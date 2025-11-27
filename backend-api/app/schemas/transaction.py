"""
Schémas Pydantic pour les transactions bancaires
"""
from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class TransactionBase(BaseModel):
    date: date
    amount: float
    vendor: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None


class TransactionCreate(TransactionBase):
    pass


class TransactionResponse(TransactionBase):
    id: int
    user_id: int
    is_reconciled: bool
    invoice_id: Optional[int] = None
    reconciliation_confidence: Optional[float] = None
    reconciliation_details: Optional[dict] = None
    source_file: Optional[str] = None
    import_batch_id: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ReconciliationRequest(BaseModel):
    transaction_id: int
    invoice_id: int


class ReconciliationResult(BaseModel):
    correspondance_trouvee: bool
    lignes_correspondantes: list
    conclusion: str
    facture: dict

