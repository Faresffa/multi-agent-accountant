import json
from Agent_optimisation.utils_optimisation import read_file, prepare_facture_json, prepare_rapprochement_json, print_results_global
from groq import Groq
from Agent_optimisation.config_optimisation import CONTEXT_FILE, PROMPT_FILE, GROQ_API_KEY, MODEL_NAME_analyse


def load_prompt_and_context(factures, rapprochements) -> tuple[str, str]:
    """Charge le contexte et remplace le placeholder dans le prompt."""
    context = read_file(CONTEXT_FILE)
    prompt_template = read_file(PROMPT_FILE)

    if not context or not prompt_template:
        raise ValueError("Impossible de charger context.txt ou prompt.txt")

    prompt = prompt_template.replace("{{factures_json}}", factures).replace("{{rapprochements_json}}", rapprochements)
    return context, prompt

        

def optimisation(factures, rapprochements) -> dict | None:
    """Appelle l'API GROQ pour analyser le code Python."""
    if not GROQ_API_KEY:
        print("[ERREUR] GROQ_API_KEY n'est pas défini.")
        return None

    context, prompt = load_prompt_and_context(factures, rapprochements)

    client = Groq(api_key=GROQ_API_KEY)

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME_analyse,
            messages=[
                {"role": "system", "content": context},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )

        raw_content = response.choices[0].message.content

        try:
            return json.loads(raw_content)
        except json.JSONDecodeError:
            print("[ERREUR] Réponse GROQ non JSON :")
            print(raw_content)
            return None

    except Exception as e:
        print(f"[ERREUR] Appel API GROQ : {e}")
        return None




if __name__ == "__main__":

    # --- Facture 1 (Argonaut Diner) ---
    facture_brut_1 = {
        'invoice_number': None,
        'invoice_date': '2017-08-13',
        'due_date': None,
        'supplier': {'name': 'Argonaut Diner2000 We Deliver', 'siret': None, 'vat': None},
        'client': {'name': 'Michael De Maio', 'siret': None, 'vat': None},
        'amounts': {'ht': 24.25, 'tva': 2.13, 'tva_rate': 8.78, 'ttc': 26.38, 'currency': 'USD'},
        'category': 'restauration / repas',
        'anomalies': [],
        'confidence_global': 1.0
    }

    # --- Rapprochement 1 ---
    banque_brut_1 = {
        'facture': {'fournisseur': 'Argonaut Diner2000 We Deliver', 'montant_ttc': 26.38, 'date': '2017-08-13'},
        'correspondance_trouvee': True,
        'lignes_correspondantes': [{
            'date': '2017-08',
            'amount': 26.38,
            'vendor': 'Argonaut Diner2000',
            'similarite_fournisseur': 0.93,
            'differences': ['montant identique', 'date identique'],
            'details_differences': {
                'montant_facture': 26.38,
                'montant_releve': 26.38,
                'ecart_montant': 0.0,
                'date_facture': '2017-08-13',
                'date_releve': '2017-08',
                'ecart_jours': 0
            },
            'niveau_confiance': 0.95
        }],
        'conclusion': 'Correspondance trouvée avec confiance élevée.'
    }

    # --- Facture 2 (Altevia Solutions) ---
    facture_brut_2 = {
        'invoice_number': 'F2025-050',
        'invoice_date': '2017-08-19',
        'due_date': '2017-09-18',
        'supplier': {'name': 'Altevia Solutions', 'siret': None, 'vat': None},
        'client': {'name': 'Société de Logistique', 'siret': None, 'vat': None},
        'amounts': {'ht': 3100, 'tva': 620, 'tva_rate': 20, 'ttc': 3720, 'currency': 'EUR'},
        'category': 'consulting / prestation',
        'anomalies': [
            'Missing supplier SIRET',
            'Missing supplier VAT',
            'Missing client SIRET',
            'Missing client VAT',
            'Invoice number year 2025 does not match invoice date 2017'
        ],
        'confidence_global': 0.7
    }

    # --- Rapprochement 2 ---
    banque_brut_2 = {
        'facture': {'fournisseur': 'Altevia Solutions', 'montant_ttc': 3720, 'date': '2017-08-19'},
        'correspondance_trouvee': False,
        'lignes_correspondantes': [],
        'conclusion': 'Aucune correspondance bancaire approximative trouvée.'
    }

    # --- 1) Préparer les données ---
    facture_prepared_1 = prepare_facture_json(facture_brut_1)
    rapprochement_prepared_1 = prepare_rapprochement_json(banque_brut_1)

    facture_prepared_2 = prepare_facture_json(facture_brut_2)
    rapprochement_prepared_2 = prepare_rapprochement_json(banque_brut_2)

    # --- 2) Construire les listes ---
    factures_list = [facture_prepared_1, facture_prepared_2]
    rapprochements_list = [rapprochement_prepared_1, rapprochement_prepared_2]

    # --- 3) Convertir en JSON strings ---
    factures_json_str = json.dumps(factures_list, ensure_ascii=False)
    rapprochements_json_str = json.dumps(rapprochements_list, ensure_ascii=False)

    # --- 4) Appeler l’agent optimisation ---
    resultat = optimisation(factures_json_str, rapprochements_json_str)

    print("\n===== RÉSULTAT OPTIMISATION =====\n")
    print_results_global(resultat)
