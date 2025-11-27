from pathlib import Path

##############
def read_file(path: str | Path) -> str | None:
    try:
        with open(path, 'r', encoding='utf-8') as fp:
            return fp.read()
    except Exception as e:
        print(f"[ERREUR] Impossible de lire {path} : {e}")
        return None


def print_results_global(result: dict):
    print("\n===== 📊 ANALYSE GLOBALE DES FACTURES =====\n")

    # --- STATISTIQUES GLOBALES ---
    stats = result.get("statistiques_globales", {})
    print("📈 Statistiques globales :")
    print(f"   - Nombre total de factures        : {stats.get('nombre_factures_total')}")
    print(f"   - Factures reçues                 : {stats.get('nombre_factures_reçues')}")
    print(f"   - Factures envoyées               : {stats.get('nombre_factures_envoyées')}")
    print(f"   - Nombre de fournisseurs          : {stats.get('nombre_fournisseurs')}")
    print(f"   - Total factures (TTC)            : {stats.get('total_factures')}")
    print(f"   - Total rapproché                 : {stats.get('total_rapproché')}")
    print(f"   - Total non rapproché             : {stats.get('total_non_rapproché')}")
    print(f"   - Taux de rapprochement           : {stats.get('taux_rapprochement')}\n")

    # --- RAPPROCHEMENTS ---
    rapproch = result.get("rapprochements", {})
    print("🔗 Rapprochements :")

    factures_r = rapproch.get("factures_rapprochées", [])
    factures_nr = rapproch.get("factures_non_rapprochées", [])

    print("   ✔ Factures rapprochées :")
    if factures_r:
        for f in factures_r:
            print(f"      - {f}")
    else:
        print("      (aucune)")

    print("\n   ❌ Factures non rapprochées :")
    if factures_nr:
        for f in factures_nr:
            print(f"      - {f}")
    else:
        print("      (aucune)")
    print()

    # --- ANALYSE FOURNISSEURS ---
    fournisseurs = result.get("analyse_fournisseurs", [])
    print("🏢 Analyse par fournisseur :")

    if fournisseurs:
        for f in fournisseurs:
            print(f"\n   • Fournisseur : {f.get('fournisseur')}")
            print(f"       - Nombre factures   : {f.get('nombre_factures')}")
            print(f"       - Total dépenses    : {f.get('total_depenses')}")
            print(f"       - Moyenne dépense   : {f.get('moyenne_depense')}")

            dep_max = f.get("depense_max", {})
            print("       - Dépense max       :")
            print(f"           > Facture ID : {dep_max.get('facture_id')}")
            print(f"           > Montant    : {dep_max.get('montant')}")

            print("       - Factures associées :")
            factures_assoc = f.get("factures_associees", [])
            if factures_assoc:
                for facture in factures_assoc:
                    print(f"           • {facture}")
            else:
                print("           (aucune)")

            anomalies = f.get("anomalies_fournisseur", [])
            if anomalies:
                print("       - ⚠ Anomalies fournisseur :")
                for a in anomalies:
                    print(f"           - {a}")
            else:
                print("       - ✔ Aucune anomalie")
    else:
        print("   (aucun fournisseur analysé)\n")

    print()

    # --- ANOMALIES GLOBALES ---
    anomalies_glob = result.get("anomalies", [])
    print("⚠️ Anomalies globales :")
    if anomalies_glob:
        for a in anomalies_glob:
            print(f"   - {a}")
    else:
        print("   ✔ Aucune anomalie détectée")
    print()

    # --- OPTIMISATIONS ---
    optim = result.get("optimisations", [])
    print("🛠️ Recommandations / Optimisations :")
    if optim:
        for o in optim:
            print(f"   - {o}")
    else:
        print("   (aucune recommandation)\n")

    # --- RÉSUMÉ ---
    print("\n📝 Résumé :")
    print(f"   {result.get('résumé')}\n")

    print("===== ✔ FIN ANALYSE GLOBALE =====\n")



##############
#PREPARE JSON#
##############

def prepare_facture_json(raw):
    supplier = raw.get("supplier", {})
    amounts = raw.get("amounts", {})

    fournisseur = supplier.get("name")
    date = raw.get("invoice_date")
    montant = amounts.get("ttc")
    devise = amounts.get("currency")
    invoice_number = raw.get("invoice_number")

    # --- Construction d'un ID robuste et unique ---
    # Nettoyage fournisseur pour éviter caractères spéciaux
    fournisseur_clean = (fournisseur or "unknown").replace(" ", "").replace("/", "")
    fournisseur_clean = fournisseur_clean[:25]  # limite de sécurité

    # Si numéro de facture manquant → "NO_NUM"
    invoice_num_clean = invoice_number if invoice_number else "NO_NUM"

    facture_id = f"F_{fournisseur_clean}_{invoice_num_clean}"

    return {
        "id": facture_id,
        "numero": invoice_number,
        "fournisseur": fournisseur,
        "date": date,
        "date_echeance": raw.get("due_date"),
        "montant_ttc": montant,
        "devise": devise,
        "categorie": raw.get("category"),
        "invoice_type": raw.get("invoice_type"),  # 🔥 important
        "anomalies": raw.get("anomalies", []),
        "confiance": raw.get("confidence_global")
    }


def prepare_rapprochement_json(raw):
    facture = raw.get("facture", {})

    # ---- 1) Récupération de l'ID si l'agent bancaire l'a renvoyé ----
    facture_id = facture.get("id")

    # ---- 2) Si l'id n'existe pas, on le reconstruit proprement ----
    if not facture_id:
        fournisseur = facture.get("fournisseur") or "unknown"
        date = facture.get("date") or "NO_DATE"

        fournisseur_clean = fournisseur.replace(" ", "").replace("/", "")[:25]
        facture_id = f"F_{fournisseur_clean}_{date}"

    # ---- 3) Récupération des lignes correspondantes ----
    lignes = raw.get("lignes_correspondantes", [])

    if lignes:
        ligne = lignes[0]
        diff = ligne.get("details_differences", {})

        return {
            "facture_id": facture_id,
            "rapprochee": True,
            "date_paiement": ligne.get("date"),
            "ecart_montant": diff.get("ecart_montant"),
            "ecart_jours": diff.get("ecart_jours"),
            "niveau_confiance": ligne.get("niveau_confiance")
        }

    # ---- 4) Si aucune correspondance ----
    return {
        "facture_id": facture_id,
        "rapprochee": False,
        "date_paiement": None,
        "ecart_montant": None,
        "ecart_jours": None,
        "niveau_confiance": 0
    }



if __name__ == "__main__":
    pass

