## 📊 Guide d'utilisation - Transactions & Rapprochement Bancaire

### Architecture

L'agent banque est maintenant **intégré directement dans FastAPI** pour une meilleure performance et fiabilité.

### 🚀 Fonctionnalités

1. **Import de transactions bancaires** (CSV/Excel)
2. **Rapprochement bancaire intelligent** avec LLM
3. **Gestion des transactions** (CRUD)
4. **Statistiques et visualisation**

---

## 📥 1. Importer des transactions

### Format de fichier attendu

**CSV ou Excel (.xlsx, .xls)** avec les colonnes suivantes :

| Colonne | Type | Obligatoire | Description |
|---------|------|-------------|-------------|
| `date` | Date | ✅ Oui | Format: YYYY-MM-DD ou DD/MM/YYYY |
| `amount` | Float | ✅ Oui | Négatif = dépense, Positif = recette |
| `vendor` | String | ❌ Non | Nom du fournisseur/client |
| `description` | String | ❌ Non | Description de la transaction |
| `category` | String | ❌ Non | Catégorie (optionnel) |

### Exemple CSV

```csv
date,amount,vendor,description
2024-01-15,-150.50,Amazon,Achat fournitures
2024-01-20,-2500.00,OVH,Hébergement serveurs
2024-01-25,5000.00,Client ABC,Paiement facture F-2024-001
```

### Endpoint API

```http
POST /api/transactions/upload
Content-Type: multipart/form-data
Authorization: Bearer {token}

file: [fichier CSV ou Excel]
```

**Réponse :**
```json
{
  "message": "45 transactions importées",
  "batch_id": "uuid-du-lot",
  "transactions_count": 45
}
```

---

## 🔄 2. Rapprochement bancaire

### Comment ça fonctionne ?

1. **Analyse intelligente** avec Groq LLM
2. **Matching flou** sur le nom du fournisseur (similarité ≥ 60%)
3. **Tolérance sur les montants** (±0.50€ = excellent, ±5€ = acceptable)
4. **Proximité de dates** (même mois = parfait, mois suivant = acceptable)

### Lancer un rapprochement

```http
POST /api/transactions/reconcile/{invoice_id}
Authorization: Bearer {token}
```

**Réponse :**
```json
{
  "facture": {
    "fournisseur": "OVH",
    "montant_ttc": 2500.00,
    "date": "2024-01-18"
  },
  "correspondance_trouvee": true,
  "lignes_correspondantes": [
    {
      "date": "2024-01",
      "amount": -2500.00,
      "vendor": "OVH SAS",
      "similarite_fournisseur": 0.95,
      "differences": [],
      "details_differences": {
        "montant_facture": 2500.00,
        "montant_releve": 2500.00,
        "ecart_montant": 0.0,
        "date_facture": "2024-01-18",
        "date_releve": "2024-01-20",
        "ecart_jours": 2
      },
      "niveau_confiance": 0.98
    }
  ],
  "conclusion": "Correspondance exacte trouvée avec une confiance de 98%"
}
```

### Confirmer un rapprochement

```http
POST /api/transactions/reconcile/{invoice_id}/confirm/{transaction_id}
Authorization: Bearer {token}
```

---

## 📋 3. Gestion des transactions

### Lister les transactions

```http
GET /api/transactions/?skip=0&limit=100&reconciled_only=false
Authorization: Bearer {token}
```

### Récupérer une transaction

```http
GET /api/transactions/{transaction_id}
Authorization: Bearer {token}
```

### Supprimer une transaction

```http
DELETE /api/transactions/{transaction_id}
Authorization: Bearer {token}
```

---

## 🎯 Workflow complet

1. **Importer vos transactions bancaires** (CSV/Excel)
2. **Consulter vos factures** dans `/api/invoices/`
3. **Lancer le rapprochement** pour une facture spécifique
4. **Analyser les résultats** (niveau de confiance, différences)
5. **Confirmer le rapprochement** si satisfait
6. **Visualiser les statistiques** dans le frontend

---

## 💡 Avantages de l'intégration

✅ **Pas de subprocess** - Tout est intégré dans FastAPI  
✅ **Plus rapide** - Pas de démarrage de processus externe  
✅ **Meilleure gestion d'erreurs** - Logs détaillés  
✅ **Cache intelligent** - Évite les doublons  
✅ **API REST complète** - Facile à utiliser depuis le frontend  

---

## 🔧 Installation

```bash
cd backend-api
pip install pandas openpyxl
# ou
pip install -r requirements.txt
```

Redémarrez le serveur :

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

---

## 📊 Modèle de données

### Transaction

```python
{
  "id": 1,
  "user_id": 1,
  "date": "2024-01-15",
  "amount": -150.50,
  "vendor": "Amazon",
  "description": "Achat fournitures",
  "category": "Fournitures",
  "is_reconciled": true,
  "invoice_id": 42,
  "reconciliation_confidence": 0.95,
  "source_file": "releve_janvier_2024.csv",
  "import_batch_id": "uuid",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

## 🎨 Frontend (à implémenter)

Page **Transactions** avec :
- 📤 Upload CSV/Excel
- 📊 Liste des transactions
- 🔄 Bouton "Rapprocher" pour chaque facture
- ✅ Confirmation des rapprochements
- 📈 Statistiques (taux de rapprochement, etc.)

