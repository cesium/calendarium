#!/usr/bin/python

from selenium import webdriver

import json

from modules.course_scraper import course_scraper
from subjects_scraper.subjects_scraper import subjects_scraper
from modules.create_filters import create_filters

print("Welcome to UMinho Schedule Scraper!")

def get_subject_codes():
    subjects_file = open("scraper/subjects.json", "r")

    subjects = json.load(subjects_file)
    subject_codes = {}
    for subject in subjects:
        subject_codes[subject["name"].lower()] = {
            "id": subject["subjectId"],
            "filterId": subject["id"]
        }

    subjects_file.close()

    return subjects, subject_codes

try:  
    subjects, subject_codes = get_subject_codes()
    print("\n-> Using subject codes from `subjects.json`")
except FileNotFoundError:
    print("\n`scraper/subjects.json` not founded. ")
    print("Read about 'Subject IDs and Filter Ids' or `subjects_scraper` on documentation\n")

    if input("Run subjects scraper? [y/N] ").lower() != "y":
        print("\nLeaving ...")
        exit()
    else:
        print("\nRunning subjects scraper: ====\n")
        subjects_scraper()
        print("\n==============================")
    
    subjects, subject_codes = get_subject_codes()

driver = webdriver.Firefox()

print("\nScraping schedules from Licenciatura em Engenharia Informática:")
shifts = course_scraper(driver, "Licenciatura em Engenharia Informática", subject_codes)

print("\nScraping schedules from Mestrado em Engenharia Informática:")
shifts += course_scraper(driver, "Mestrado em Engenharia Informática", subject_codes)

with open("data/shifts.json", "w") as outfile:
    json.dump(shifts, outfile, indent=2, ensure_ascii=False)

print(f"\nDone. Scraped {len(shifts)} shifts from the schedules!")
print(f"Check them at data/shifts.json\n")

filters = create_filters(shifts, subjects)
with open("data/filters.json", "w") as outfile:
    json.dump(filters, outfile, indent=2, ensure_ascii=False)

print(f"\nDone. Stored {len(filters)} filters!")
print(f"Check them at data/filters.json\n")

driver.close()

