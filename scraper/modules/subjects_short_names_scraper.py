#!/usr/bin/python

import json
from requests import get

manual_subject_names = {

    # UMinho Optional Subjects
    "15419": {
        "name": "Bilinguismo",
        "short_name": "Bilinguismo",
    },
    "13556": {
        "name": "Cidadania Digital",
        "short_name": "CD",
    },
    "16175": {
        "name": "Democracia Plena, Responsabilidade e Estado de Direito",
        "short_name": "DPRED",
    },
    "16176": {
        "name": "Direito Laboral",
        "short_name": "DL",
    },
    "14126": {
        "name": "Educação e Cidadania Global Criativa",
        "short_name": "ECGC",
    },
    "11773": {
        "name": "Educação, Cidadania e Direitos Humanos",
        "short_name": "ECDH",
    },
    "11738": {
        "name": "Inglês Académico",
        "short_name": "IA",
    },
    "15417": {
        "name": "Introdução à Língua e Cultura Russa",
        "short_name": "ILCR",
    },
    "15410": {
        "name": "Literacia Fotográfica da Física à Mensagem",
        "short_name": "LFFM",
    },
    "10892": {
        "name": "Matemática das Coisas",
        "short_name": "MC",
    },
    "10986": {
        "name": "Princípios de Gestão de Inventários",
        "short_name": "PGI",
    },
    "12365": {
        "name": "Substâncias que Mudaram o Mundo",
        "short_name": "SMM",
    },
    "13403": {
        "name": "Sustentabilidade Ambiental, Social e Económica",
        "short_name": "SASE",
    },
    "16178": {
        "name": "Temas de Direito da Igualdade e Não Discriminação",
        "short_name": "TDIND",
    },
    "10886": {
        "name": "Tópicos de Astronomia e Cosmologia",
        "short_name": "TAC",
    },

    "14602": {
        "name": "Projeto de Informática",
        "short_name": "PI"
    },
    "14603": {
        "name": "Dissertação",
        "short_name": "D"
    },
}


def get_subjects_short_names_scraper():
    print("\nRunning subjects names scraper: ====\n")
    print("Welcome to CeSIUM Subjects Name Scraper!")

    print("\nDownloading and parsing `filters.json` from Calendarium's GitHub repository")
    filters_resp = get(
        "https://raw.githubusercontent.com/cesium/calendarium/d595fdf2e60c4117fc8a38df1b1751d452c8993a/data/filters.json")
    filters = json.loads(filters_resp.text)

    print("Downloading and parsing `shifts.json` from Calendarium's GitHub repository\n")
    shifts_resp = get(
        "https://raw.githubusercontent.com/cesium/calendarium/d595fdf2e60c4117fc8a38df1b1751d452c8993a/data/shifts.json")
    shifts = json.loads(shifts_resp.text)

    names = {}

    print("Not founded info on `shifts.json` about:")

    for subject in filters:
        filter_id = subject["id"]

        subject_id = name = None

        for shift in shifts:
            if shift["filterId"] == filter_id:
                subject_id = shift["id"]
                name = shift["title"]

        if not subject_id or not name:
            print(f"\t {subject['name']} (filterId {subject['id']})")

        else:
            names[subject_id] = {
                "name": name,
                "short_name": subject["name"]
            }

    names.update(manual_subject_names)

    print(f"\nAdded manually the following subjects names:")
    for subject in manual_subject_names.values():
        print("\t" + subject['name'])

    with open("scraper/subjects_short_names.json", "w") as outfile:
        json.dump(names, outfile, indent=2, ensure_ascii=False)

    print(f"\nDone. Stored {len(names)} names!")
    print(f"Check them at scraper/subjects_short_names.json")

    print("\n==============================")
