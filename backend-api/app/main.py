"""
Point d'entrée principal de l'API FastAPI
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import engine, Base
from app.api import auth, invoices, transactions
from app.models import User, Invoice, Transaction  # Import pour créer les tables

# Créer les tables PostgreSQL
try:
    Base.metadata.create_all(bind=engine)
    print("✅ PostgreSQL database connected and tables created!")
except Exception as e:
    print(f"⚠️ Warning: Could not connect to PostgreSQL: {e}")
    print("⚠️ The API will start but database operations will fail.")

# Application FastAPI
app = FastAPI(
    title=settings.APP_NAME,
    description="Agent Comptable Automatique - Multi-agents pour indépendants & PME",
    version="0.1.0",
    debug=settings.DEBUG
)

# Configuration CORS (permissif en développement)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(invoices.router, prefix="/api/invoices", tags=["Invoices"])
app.include_router(transactions.router, prefix="/api/transactions", tags=["Transactions"])


@app.get("/")
async def root():
    return {
        "message": "Bill'z API - Agent Comptable Automatique",
        "version": "0.1.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}

