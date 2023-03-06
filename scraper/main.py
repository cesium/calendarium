#!/usr/bin/python

from selenium import webdriver

import json

from modules.subjects_scraper import subjects_scraper
from modules.course_scraper import course_scraper
from modules.create_filters import create_filters

print("Welcome to UMinho Schedule Scraper!")

driver = webdriver.Firefox()

subjects, subject_codes = subjects_scraper(driver)

print("\nScraping schedules from Licenciatura em Engenharia Informática:")
shifts = course_scraper(
    driver, "Licenciatura em Engenharia Informática", subject_codes)

print("\nScraping schedules from Mestrado em Engenharia Informática:")
shifts += course_scraper(driver,
                         "Mestrado em Engenharia Informática", subject_codes)

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
