"""
Modèle Transaction pour stocker les transactions bancaires
"""
from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Boolean, ForeignKey, JSON
from sqlalchemy.sql import func
from app.core.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Informations transaction
    date = Column(Date, nullable=False, index=True)
    amount = Column(Float, nullable=False)  # Négatif = dépense, Positif = recette
    vendor = Column(String, nullable=True)  # Fournisseur/Client
    description = Column(String, nullable=True)
    category = Column(String, nullable=True)
    
    # Rapprochement
    is_reconciled = Column(Boolean, default=False)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=True)
    reconciliation_confidence = Column(Float, nullable=True)  # Score de confiance 0-1
    reconciliation_details = Column(JSON, nullable=True)  # Détails du rapprochement
    
    # Métadonnées
    source_file = Column(String, nullable=True)  # Nom du fichier importé
    import_batch_id = Column(String, nullable=True)  # ID du lot d'import
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

