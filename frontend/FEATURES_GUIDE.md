# 📱 Guide des fonctionnalités Frontend - Bill'z

## 🎯 Vue d'ensemble

Bill'z est une application de comptabilité automatique avec 3 agents intelligents intégrés :
- **Agent Factures** : Scan Gmail et extraction automatique
- **Agent Banque** : Import transactions et rapprochement bancaire
- **Agent Optimisation** : Conseils fiscaux et optimisations

---

## 📄 Page Factures

### Fonctionnalités

1. **Scanner Gmail** 
   - Cliquez sur "Scanner Gmail"
   - L'agent se connecte à votre Gmail
   - Extrait automatiquement les factures PDF des emails
   - Analyse avec LLM (Groq)
   - Enregistre en base de données

2. **Visualiser les factures**
   - Liste complète avec détails (fournisseur, montants, dates)
   - Statut : Valide ✓ ou Anomalies ⚠
   - Catégorisation automatique

3. **Actions sur les factures**
   - 🔗 **Rapprocher** : Lance le rapprochement bancaire
   - 📥 **Voir PDF** : Ouvre le PDF dans un nouvel onglet
   - 🗑️ **Supprimer** : Supprime la facture

4. **Rapprochement bancaire**
   - Cliquez sur l'icône 🔗 sur une facture
   - L'agent analyse vos transactions
   - Trouve les correspondances automatiquement
   - Affiche le niveau de confiance
   - Permet de confirmer le rapprochement

---

## 💳 Page Transactions

### Fonctionnalités

1. **Importer des transactions**
   - Cliquez sur "Importer CSV/Excel"
   - Formats supportés : `.csv`, `.xlsx`, `.xls`
   - Les transactions sont automatiquement importées

2. **Format de fichier attendu**

```csv
date,amount,vendor,description,category
2024-01-15,-150.50,Amazon,Achat fournitures,Fournitures
2024-01-20,-2500.00,OVH,Hébergement serveurs,Infrastructure
2024-01-25,5000.00,Client ABC,Paiement facture,Recette
```

**Colonnes obligatoires :**
- `date` : Format YYYY-MM-DD ou DD/MM/YYYY
- `amount` : Négatif = dépense, Positif = recette

**Colonnes optionnelles :**
- `vendor` : Nom du fournisseur/client
- `description` : Description de la transaction
- `category` : Catégorie

3. **Visualiser les transactions**
   - Liste complète avec filtres
   - Statut : Rapprochée ✓ ou Non rapprochée ✗
   - Statistiques en temps réel

4. **Statistiques**
   - Total de transactions
   - Recettes (montants positifs)
   - Dépenses (montants négatifs)
   - Taux de rapprochement

---

## 🔄 Workflow complet

### Scénario 1 : Import et rapprochement

1. **Importer vos transactions bancaires**
   - Page Transactions → "Importer CSV/Excel"
   - Sélectionnez votre relevé bancaire

2. **Scanner vos factures Gmail**
   - Page Factures → "Scanner Gmail"
   - Attendez la fin du scan

3. **Rapprocher une facture**
   - Page Factures → Cliquez sur 🔗 à côté d'une facture
   - Consultez les résultats du rapprochement
   - Confirmez si la correspondance est bonne

### Scénario 2 : Vérification des anomalies

1. **Identifier les factures avec anomalies**
   - Page Factures → Cherchez le badge ⚠ "X anomalies"

2. **Consulter les anomalies**
   - Cliquez sur le badge
   - Lisez la liste des anomalies détectées
   - Vérifiez le PDF si nécessaire

---

## 🎨 Interface

### Thème
- Design moderne avec Tailwind CSS
- Mode sombre par défaut
- Animations fluides
- Responsive (desktop & mobile)

### Composants
- **Cards** : Conteneurs avec effet glow
- **Buttons** : Primary (bleu) et Secondary (gris)
- **Modals** : Popups pour détails et confirmations
- **Tables** : Listes avec hover effects
- **Stats Cards** : Indicateurs visuels

---

## 🚀 Prochaines fonctionnalités

- [ ] Page Optimisation (conseils fiscaux)
- [ ] Dashboard avec graphiques
- [ ] Export PDF des rapports
- [ ] Notifications en temps réel
- [ ] Filtres avancés
- [ ] Recherche full-text
- [ ] Multi-utilisateurs

---

## 💡 Astuces

1. **Import régulier** : Importez vos transactions chaque mois
2. **Scan Gmail** : Lancez le scan régulièrement pour capturer les nouvelles factures
3. **Vérification** : Consultez toujours les anomalies détectées
4. **Rapprochement** : Utilisez le rapprochement automatique pour gagner du temps

---

## 🐛 Dépannage

### Le scan Gmail ne fonctionne pas
- Vérifiez que `credentials.json` et `token.json` sont dans `backend-api/`
- Redémarrez le backend

### L'import CSV échoue
- Vérifiez le format du fichier (colonnes obligatoires)
- Vérifiez le format des dates

### Le rapprochement ne trouve rien
- Assurez-vous d'avoir importé des transactions
- Vérifiez que les dates correspondent (même mois)

---

## 📞 Support

Pour toute question ou problème, consultez :
- `backend-api/TRANSACTIONS_GUIDE.md` - Guide API
- `backend-api/README.md` - Configuration backend
- Logs du serveur pour les erreurs détaillées

