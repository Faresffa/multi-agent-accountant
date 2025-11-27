"""
Routes API pour les transactions bancaires
"""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import pandas as pd
import io
from datetime import datetime
import uuid

from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.models.transaction import Transaction
from app.models.invoice import Invoice
from app.schemas.transaction import TransactionResponse, ReconciliationResult
from app.services.bank_reconciliation import BankReconciliationService

router = APIRouter()


@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_transactions(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload un fichier CSV ou Excel de transactions bancaires
    
    Format attendu:
    - date (YYYY-MM-DD ou DD/MM/YYYY)
    - amount (float, négatif = dépense)
    - vendor (string, optionnel)
    - description (string, optionnel)
    """
    try:
        # Lire le fichier
        contents = await file.read()
        
        # Déterminer le type de fichier
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents))
        elif file.filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(io.BytesIO(contents))
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Format non supporté. Utilisez CSV ou Excel (.xlsx, .xls)"
            )
        
        # Vérifier les colonnes requises
        required_columns = ['date', 'amount']
        missing = [col for col in required_columns if col not in df.columns]
        if missing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Colonnes manquantes: {', '.join(missing)}"
            )
        
        # Générer un ID de batch pour ce lot d'import
        batch_id = str(uuid.uuid4())
        
        # Importer les transactions
        transactions_created = 0
        for _, row in df.iterrows():
            try:
                # Parser la date
                if isinstance(row['date'], str):
                    # Essayer différents formats
                    for fmt in ['%Y-%m-%d', '%d/%m/%Y', '%Y/%m/%d', '%d-%m-%Y']:
                        try:
                            transaction_date = datetime.strptime(row['date'], fmt).date()
                            break
                        except ValueError:
                            continue
                    else:
                        print(f"[WARNING] Date invalide: {row['date']}")
                        continue
                else:
                    transaction_date = pd.to_datetime(row['date']).date()
                
                # Créer la transaction
                transaction = Transaction(
                    user_id=current_user.id,
                    date=transaction_date,
                    amount=float(row['amount']),
                    vendor=str(row.get('vendor', '')) if pd.notna(row.get('vendor')) else None,
                    description=str(row.get('description', '')) if pd.notna(row.get('description')) else None,
                    category=str(row.get('category', '')) if pd.notna(row.get('category')) else None,
                    source_file=file.filename,
                    import_batch_id=batch_id
                )
                
                db.add(transaction)
                transactions_created += 1
            
            except Exception as e:
                print(f"[ERROR] Erreur ligne: {e}")
                continue
        
        db.commit()
        
        return {
            "message": f"{transactions_created} transactions importées",
            "batch_id": batch_id,
            "transactions_count": transactions_created
        }
    
    except pd.errors.EmptyDataError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Le fichier est vide"
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de l'import: {str(e)}"
        )


@router.get("/", response_model=List[TransactionResponse])
async def get_transactions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    reconciled_only: bool = False
):
    """
    Récupérer les transactions de l'utilisateur
    """
    query = db.query(Transaction).filter(Transaction.user_id == current_user.id)
    
    if reconciled_only:
        query = query.filter(Transaction.is_reconciled == True)
    
    transactions = query.order_by(Transaction.date.desc()).offset(skip).limit(limit).all()
    return transactions


@router.get("/{transaction_id}", response_model=TransactionResponse)
async def get_transaction(
    transaction_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Récupérer une transaction spécifique
    """
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == current_user.id
    ).first()
    
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction non trouvée"
        )
    
    return transaction


@router.post("/reconcile/{invoice_id}")
async def reconcile_invoice(
    invoice_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Lance le rapprochement bancaire pour une facture
    """
    # Récupérer la facture
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id,
        Invoice.user_id == current_user.id
    ).first()
    
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Facture non trouvée"
        )
    
    # Récupérer les transactions non rapprochées
    transactions = db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.is_reconciled == False
    ).all()
    
    if not transactions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aucune transaction disponible pour le rapprochement"
        )
    
    # Créer un mapping transaction_id -> transaction pour retrouver les IDs
    transaction_map = {
        f"{t.date}_{t.amount}_{t.vendor}": t.id
        for t in transactions
    }
    
    # Préparer les données pour le rapprochement
    invoice_data = {
        "fournisseur": invoice.supplier.get('name') if isinstance(invoice.supplier, dict) else str(invoice.supplier),
        "montant_ttc": invoice.amounts.get('ttc') if isinstance(invoice.amounts, dict) else 0,
        "date": str(invoice.invoice_date),
        "invoice_number": invoice.invoice_number
    }
    
    bank_transactions = [
        {
            "date": str(t.date),
            "amount": t.amount,
            "vendor": t.vendor or "",
            "description": t.description or "",
            "transaction_id": t.id  # Ajouter l'ID pour le retrouver
        }
        for t in transactions
    ]
    
    # Effectuer le rapprochement
    service = BankReconciliationService()
    result = service.reconcile(
        invoice_data=invoice_data,
        bank_transactions=bank_transactions,
        invoice_type="reception" if invoice.invoice_type == "entrante" else "envoi"
    )
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors du rapprochement"
        )
    
    # Ajouter les transaction_ids aux lignes correspondantes
    if result.get('lignes_correspondantes'):
        for ligne in result['lignes_correspondantes']:
            # Retrouver l'ID de la transaction
            # Le LLM retourne la date au format YYYY-MM, on doit matcher avec YYYY-MM-DD
            ligne_date = ligne.get('date', '')  # Format YYYY-MM du LLM
            ligne_amount = ligne.get('amount', 0)
            ligne_vendor = ligne.get('vendor', '')
            
            # Chercher la transaction correspondante
            for t in transactions:
                # Comparer le début de la date (YYYY-MM)
                transaction_date_prefix = str(t.date)[:7]  # YYYY-MM-DD -> YYYY-MM
                
                # Match si date (YYYY-MM), montant et vendor correspondent
                if (transaction_date_prefix == ligne_date and 
                    abs(t.amount - ligne_amount) < 0.01 and  # Tolérance pour float
                    (t.vendor or "") == ligne_vendor):
                    ligne['transaction_id'] = t.id
                    print(f"[MATCH] Transaction {t.id} matched: {t.date} / {t.amount} / {t.vendor}")
                    break
            
            # Si pas trouvé, essayer un matching plus souple
            if 'transaction_id' not in ligne:
                print(f"[WARNING] No exact match for ligne: {ligne_date} / {ligne_amount} / {ligne_vendor}")
                # Essayer de trouver par montant seul (moins fiable mais mieux que rien)
                for t in transactions:
                    if abs(t.amount - ligne_amount) < 0.01:
                        ligne['transaction_id'] = t.id
                        print(f"[MATCH FALLBACK] Transaction {t.id} matched by amount only")
                        break
    
    return result


@router.post("/reconcile/{invoice_id}/confirm/{transaction_id}")
async def confirm_reconciliation(
    invoice_id: int,
    transaction_id: int,
    confidence: float = 1.0,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Confirme le rapprochement entre une facture et une transaction
    
    Args:
        invoice_id: ID de la facture
        transaction_id: ID de la transaction
        confidence: Niveau de confiance (0-1), par défaut 1.0 pour confirmation manuelle
    """
    # Vérifier que la facture et la transaction appartiennent à l'utilisateur
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id,
        Invoice.user_id == current_user.id
    ).first()
    
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == current_user.id
    ).first()
    
    if not invoice or not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Facture ou transaction non trouvée"
        )
    
    # Vérifier si la transaction n'est pas déjà rapprochée
    if transaction.is_reconciled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cette transaction est déjà rapprochée"
        )
    
    # Préparer les détails du rapprochement
    reconciliation_details = {
        "invoice_number": invoice.invoice_number,
        "invoice_date": str(invoice.invoice_date),
        "supplier": invoice.supplier.get('name') if isinstance(invoice.supplier, dict) else str(invoice.supplier),
        "amount_invoice": invoice.amounts.get('ttc') if isinstance(invoice.amounts, dict) else 0,
        "amount_transaction": transaction.amount,
        "confirmed_at": str(datetime.now()),
        "confirmed_by": "user"
    }
    
    # Marquer la transaction comme rapprochée
    transaction.is_reconciled = True
    transaction.invoice_id = invoice_id
    transaction.reconciliation_confidence = confidence
    transaction.reconciliation_details = reconciliation_details
    
    db.commit()
    db.refresh(transaction)
    
    return {
        "success": True,
        "message": "Rapprochement confirmé avec succès",
        "transaction_id": transaction_id,
        "invoice_id": invoice_id,
        "confidence": confidence,
        "details": reconciliation_details
    }


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_transaction(
    transaction_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Supprimer une transaction
    """
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == current_user.id
    ).first()
    
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction non trouvée"
        )
    
    db.delete(transaction)
    db.commit()
    
    return None

