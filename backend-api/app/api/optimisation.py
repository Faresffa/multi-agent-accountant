"""
Routes API pour l'optimisation fiscale et l'analyse comptable
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.services.optimisation_service import OptimisationService

router = APIRouter()


@router.get("/analyze")
async def get_analysis(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Analyse comptable complète de l'utilisateur
    
    Retourne:
    - Statistiques globales
    - Analyse par fournisseur
    - Anomalies détectées
    - Recommandations d'optimisation
    - Résumé
    """
    service = OptimisationService()
    result = service.analyze(user_id=current_user.id, db=db)
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de l'analyse"
        )
    
    return result


@router.get("/tva")
async def get_tva_analysis(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Analyse spécifique de la TVA
    
    Retourne:
    - TVA collectée (sur ventes)
    - TVA déductible (sur achats)
    - TVA à payer
    - Conseils
    """
    service = OptimisationService()
    result = service.get_tva_analysis(user_id=current_user.id, db=db)
    
    return result


@router.get("/stats")
async def get_quick_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Statistiques rapides sans analyse LLM
    """
    from app.models.invoice import Invoice
    from app.models.transaction import Transaction
    
    # Compter les factures
    total_invoices = db.query(Invoice).filter(Invoice.user_id == current_user.id).count()
    invoices_received = db.query(Invoice).filter(
        Invoice.user_id == current_user.id,
        Invoice.invoice_type == "entrante"
    ).count()
    invoices_sent = db.query(Invoice).filter(
        Invoice.user_id == current_user.id,
        Invoice.invoice_type == "sortante"
    ).count()
    
    # Compter les transactions
    total_transactions = db.query(Transaction).filter(Transaction.user_id == current_user.id).count()
    reconciled_transactions = db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.is_reconciled == True
    ).count()
    
    # Calculer les montants
    invoices = db.query(Invoice).filter(Invoice.user_id == current_user.id).all()
    total_amount = sum(
        inv.amounts.get('ttc', 0) if isinstance(inv.amounts, dict) else 0
        for inv in invoices
    )
    
    return {
        "factures": {
            "total": total_invoices,
            "reçues": invoices_received,
            "envoyées": invoices_sent
        },
        "transactions": {
            "total": total_transactions,
            "rapprochées": reconciled_transactions,
            "taux_rapprochement": round(reconciled_transactions / total_transactions * 100, 1) if total_transactions > 0 else 0
        },
        "montants": {
            "total_factures": round(total_amount, 2)
        }
    }

