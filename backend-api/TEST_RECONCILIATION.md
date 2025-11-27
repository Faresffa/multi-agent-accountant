# 🧪 Guide de test - Rapprochement bancaire

## Prérequis

1. Backend démarré sur `http://127.0.0.1:8001`
2. Frontend démarré sur `http://localhost:5173`
3. Compte utilisateur créé et connecté
4. Transactions importées
5. Factures scannées ou uploadées

---

## 📋 Scénario de test complet

### Étape 1 : Préparer les données de test

**Créer un fichier CSV de transactions** (`test_transactions.csv`) :

```csv
date,amount,vendor,description
2024-11-15,-150.50,Amazon France,Achat fournitures bureau
2024-11-20,-2500.00,OVH SAS,Hébergement serveurs cloud
2024-11-25,5000.00,Client ABC,Paiement facture F-2024-001
2024-11-28,-89.99,Microsoft,Abonnement Office 365
```

### Étape 2 : Importer les transactions

1. Aller sur **Page Transactions**
2. Cliquer sur **"Importer CSV/Excel"**
3. Sélectionner `test_transactions.csv`
4. Vérifier que 4 transactions sont importées
5. Vérifier les statistiques :
   - Total : 4
   - Recettes : +5000.00 €
   - Dépenses : -2740.49 €
   - Rapprochées : 0/4

### Étape 3 : Scanner ou créer une facture

**Option A : Scanner Gmail**
1. Aller sur **Page Factures**
2. Cliquer sur **"Scanner Gmail"**
3. Attendre la fin du scan

**Option B : Créer manuellement via API**
```bash
curl -X POST http://127.0.0.1:8001/api/invoices/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@facture_test.pdf" \
  -F 'extracted_data={"invoice_number":"F-2024-001","invoice_date":"2024-11-20","supplier":{"name":"OVH","siret":"123456789"},"amounts":{"ht":2083.33,"tva":416.67,"tva_rate":20,"ttc":2500.00}}'
```

### Étape 4 : Lancer le rapprochement

1. Sur la **Page Factures**, trouver la facture OVH (2500€)
2. Cliquer sur l'icône **🔗 (Rapprocher)**
3. Attendre l'analyse (quelques secondes)

**Résultat attendu :**
- Modal s'ouvre avec les résultats
- Correspondance trouvée : ✓
- 1 transaction correspondante affichée
- Niveau de confiance : ~95-98%
- Détails :
  - Vendor : OVH SAS
  - Montant : -2500.00 €
  - Date : 2024-11
  - Similarité fournisseur : ~95%
  - Écart montant : 0.0 €
  - Écart jours : 0

### Étape 5 : Confirmer le rapprochement

1. Dans la modal, vérifier les informations
2. Cliquer sur **"Confirmer ce rapprochement (XX% confiance)"**
3. Confirmer dans la popup
4. Vérifier le message de succès : "✓ Rapprochement confirmé avec succès !"

### Étape 6 : Vérifier le résultat

**Page Transactions :**
- La transaction OVH doit maintenant être marquée **"Rapprochée ✓"**
- Statistiques mises à jour : Rapprochées : 1/4

**Base de données :**
```sql
SELECT * FROM transactions WHERE is_reconciled = true;
```

Devrait retourner :
```
id | date       | amount   | vendor  | is_reconciled | invoice_id | reconciliation_confidence
1  | 2024-11-20 | -2500.00 | OVH SAS | true          | 1          | 0.95
```

---

## 🎯 Tests de cas limites

### Test 1 : Rapprochement avec faible confiance

**Données :**
- Facture : Amazon, 150€, 2024-11-15
- Transaction : Amazon France, -150.50€, 2024-11-15

**Résultat attendu :**
- Correspondance trouvée mais avec différence de montant
- Niveau de confiance : ~85%
- Affichage du warning : "Écart montant : 0.50 €"
- Bouton de confirmation manuel affiché

### Test 2 : Aucune correspondance

**Données :**
- Facture : Google Cloud, 500€, 2024-12-01
- Transactions : Aucune correspondante

**Résultat attendu :**
- Modal affiche : "⚠ Aucune correspondance"
- Conclusion : "Aucune transaction bancaire ne correspond à cette facture"
- Pas de bouton de confirmation

### Test 3 : Transaction déjà rapprochée

**Données :**
- Essayer de rapprocher une transaction déjà confirmée

**Résultat attendu :**
- Erreur API : "Cette transaction est déjà rapprochée"
- Message d'erreur affiché dans le frontend

---

## 🔍 Vérifications techniques

### Backend

**Logs à surveiller :**
```
[SCAN] Connexion à Gmail...
[SCAN] Récupération des emails...
[SCAN] 5 emails avec pièces jointes trouvés
[OK] Facture #F-2024-001 enregistrée (ID: 1)
```

**Endpoints testés :**
- ✅ `POST /api/transactions/upload`
- ✅ `GET /api/transactions/`
- ✅ `POST /api/transactions/reconcile/{invoice_id}`
- ✅ `POST /api/transactions/reconcile/{invoice_id}/confirm/{transaction_id}`

### Frontend

**États à vérifier :**
- `reconcilingInvoiceId` : null après rapprochement
- `reconciliationResult` : contient les données du rapprochement
- `showReconciliationModal` : true pendant l'affichage

**Animations :**
- Icône 🔗 pulse pendant le rapprochement
- Modal s'ouvre avec animation
- Barres de progression pour confiance/similarité

---

## 🐛 Dépannage

### Erreur : "Aucune transaction disponible"
- Vérifiez que des transactions sont importées
- Vérifiez qu'elles ne sont pas toutes déjà rapprochées

### Erreur : "transaction_id manquant"
- Redémarrez le backend (bug de cache)
- Vérifiez que le backend retourne bien les IDs

### Le rapprochement ne trouve rien
- Vérifiez les dates (doivent être dans le même mois)
- Vérifiez les montants (tolérance ±5€)
- Vérifiez le nom du fournisseur (similarité ≥60%)

### La confirmation échoue
- Vérifiez que l'utilisateur est bien connecté
- Vérifiez que la transaction n'est pas déjà rapprochée
- Consultez les logs backend pour plus de détails

---

## 📊 Métriques de succès

✅ **Import** : 100% des lignes CSV importées  
✅ **Rapprochement** : Temps < 5 secondes  
✅ **Précision** : Confiance ≥ 70% pour correspondances valides  
✅ **UX** : Confirmation en 2 clics maximum  

---

## 🚀 Tests automatisés (à implémenter)

```python
# tests/test_reconciliation.py

def test_reconcile_exact_match():
    # Créer une facture et une transaction identiques
    # Lancer le rapprochement
    # Vérifier confiance = 1.0
    pass

def test_reconcile_partial_match():
    # Créer une facture et une transaction avec écart
    # Lancer le rapprochement
    # Vérifier confiance entre 0.7 et 0.9
    pass

def test_confirm_reconciliation():
    # Confirmer un rapprochement
    # Vérifier is_reconciled = True
    # Vérifier invoice_id est set
    pass
```

