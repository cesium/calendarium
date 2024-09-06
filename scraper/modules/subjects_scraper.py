#!/usr/bin/python

from selenium.webdriver.remote.webdriver import WebDriver, WebElement
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException, StaleElementReferenceException, TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.expected_conditions import presence_of_element_located

from modules.subjects_short_names_scraper import get_subjects_short_names_scraper

import json
from time import sleep
from unidecode import unidecode
from collections import Counter
from os import path


def subjects_scraper(driver: WebDriver):
    """
    Scrape the courses's subjects on a given driver.

    Parameters
    ----------
    driver : WebDriver
        The selenium driver.

    Returns
    -------
    [{
        "id": int,
        "subjectId": int,
        "name": str,
        "short_name": str,
        "year": int,
        "semester": int
    }]
    """

    subjects_short_names_path = path.join("scraper", "subjects_short_names.json")

    # To compatibility with old version of Calendarium, we use the subjects short names available at GitHub
    try:
        subjects_short_names = json.load(
            open(subjects_short_names_path, encoding="utf-8"))
    except FileNotFoundError:
        get_subjects_short_names_scraper()
        subjects_short_names = json.load(open(subjects_short_names_path, encoding="utf-8"))

    # This function will store the return at a file. If the file already exists, we can skip this function
    try:
        subjects, subject_codes = get_subject_codes_from_file()
        print("\n-> Using subject codes from `subjects.json`")
        return subjects, subject_codes
    except FileNotFoundError:
        pass

    print("\nRunning subjects scraper: ====")

    print("\nWelcome to UMinho Subjects Scraper!")

    print("\nRead about 'Subject IDs and Filter Ids' or `subjects_scraper` on documentation.")

    print(f"\n\033[32m\033[1mNOTE:\033[0m You gonna probably see some \033[93m\033[1mWARNING\033[0m messages. Is important correct them, before go to production, in `scraper/subjects.json`, `data/shifts.json` and `data/filters.json`.")

    print("\n\033[1mScraping subjects from Licenciatura em Engenharia Informática\033[0m:")
    subjects = scraper(driver, "Licenciatura em Engenharia Informática", subjects_short_names)

    print("\n\033[1mScraping subjects from Mestrado em Engenharia Informática\033[0m:")
    subjects += scraper(driver, "Mestrado em Engenharia Informática", subjects_short_names, master=True)

    # ===============================
    # Make here your manual editions
    # ===============================

    manual_subjects = [{
        "id": 329,
        "subjectId": 14322,
        "name": "Análise e Teste de Software",
        "short_name": "ATS",
        "year": 3,
        "semester": 2
    }]

    print("")
    for subject in manual_subjects:
        print(f"\033[91m\033[1mWARNING:\033[0m Adding manually `{subject['name']}` subject.")
    
    subjects += manual_subjects

    # =====================

    # Store the subjects
    with open(path.join("scraper", "subjects.json"), "w") as outfile:
        json.dump(subjects, outfile, indent=2, ensure_ascii=False)

    print(f"\nDone. Scraped {len(subjects)} subjects from the UMinho page!")
    print(f"Check them at scraper/subjects.json\n")

    # Find repeated subjects short names to warn the user
    short_names_list = list(map(lambda subject: subject["short_name"], subjects))
    for short_name, repeated_times in Counter(short_names_list).items():
        if repeated_times > 1:
            print(f"\033[91m\033[1mWARNING:\033[0m {short_name} short name is used {repeated_times} times.")

    print("\n==============================")

    return get_subject_codes_from_file()


def scraper(driver: WebDriver, course_name: str, short_names, master: bool = False):
    """
    Scrape subjects of a given course.

    Parameters
    ----------
    driver : WebDriver
    The selenium driver.

    course_name : str
    The name of the course to scrape.
    Should be equal to the ones that are on the course picker.

    short_names : dict
    Give to the scraper the short name for each subject.

    {
        str: { # subject Id 
            "name": str, # complete name
            "short_name": # short name
        }
    }

    master: bool , optional
    Is this course a master?

    Returns
    -------
    [{
        "id": int, # filterId
        "subjectId": int, 
        "name": string,
        "short_name": string,
        "year": int,
        "semester": int
    }]
    """

    endpoint = "licenciaturas-e-mestrados-integrados" if not master else "Mestrados"
    driver.get(
        f"https://www.uminho.pt/PT/ensino/oferta-educativa/Cursos-Conferentes-a-Grau/Paginas/{endpoint}.aspx")

    # search courses input
    driver.find_element(By.CSS_SELECTOR, "input.form-control") \
        .send_keys(course_name.removeprefix("Licenciatura em ").removeprefix("Mestrado em ").removeprefix("Mestrado Integrado em "))

    # search button
    driver.find_element(By.CSS_SELECTOR, ".input-group-addon").click()

    courses_pickers = driver.find_elements(
        By.CSS_SELECTOR, "div.row td .noshow")

    for picker in courses_pickers:
        if course_name in picker.text:
            click_on_element(driver, picker)
    
    # Inside Course Page

    tabs_container = get_future_element_with_timeout(driver, "ul.nav.nav-tabs", timeout=30)
    tabs_available = tabs_container.find_elements(By.CSS_SELECTOR, "ul.nav.nav-tabs li")

    for tab in tabs_available:
        if tab.text == "Plano de Estudos":
            tab.click()

    subjects_trs_amount = len(driver.find_elements(
        By.CSS_SELECTOR, ".col-md-12 tbody tr"))

    subjects = []
    subjects_ids_control = [] # to avoid repeated subjects ids
    
    year_counter = 1
    semester_counter = 1
    filter_id_counter = 1

    for i in range(0, subjects_trs_amount):
        table_rows = driver.find_elements(
            By.CSS_SELECTOR, ".col-md-12 tbody tr")[i]

        table_row_cells = table_rows.find_elements(By.CSS_SELECTOR, "td")

        if len(table_row_cells) == 2:  # header
            year_span = table_row_cells[0].find_element(By.CSS_SELECTOR, "span")
            year_counter = int(year_span.text.removeprefix(
                "Ano ")) + (3 if master else 0)

        elif len(table_row_cells) == 4:  # subject
            semester_string = table_row_cells[0].text.removeprefix("S")

            if semester_string.isnumeric():
                semester_counter = int(semester_string)
            elif semester_string != "":
                semester_counter = 0

            if table_row_cells[2].text == "":
                # Opção UMinho / de mestrado
                continue

            # Reset filter_id_counter each time the semester changes
            if subjects != [] and (subjects[-1]["semester"] != semester_counter or subjects[-1]["year"] != year_counter):
                filter_id_counter = 1

            subject_name = table_row_cells[1].text

            # Getting subjectId ===
            more_info_button = get_future_element_with_timeout(table_row_cells[1], "a", exit_on_timeout=False)

            if more_info_button:
                click_on_element(driver, more_info_button)

                latest_id = f'{subjects[-1]["subjectId"]}' if len(subjects) > 0 else ""

                # Even with the wait_until_update function I prefer use a delay to the website load completely the data
                sleep(0.6)
                wait_until_element_text_updates_with_timeout(driver, "#myModalUC .modal-content .row .col-md-10 span", latest_id, timeout=15, exit_on_timeout=False)
                sleep(0.6)

                subject_id_span = driver.find_element(By.CSS_SELECTOR, ".modal-content .row .col-md-10 span")
                subject_id = int(subject_id_span.text) or 0

                close_button = driver.find_element(By.CSS_SELECTOR, ".close")
                click_on_element(driver, close_button)
            else:
                subject_id = 0

            if filter_id_counter == 1:
                print(
                    f"\n\tScraping subjects from {year_counter} year and {semester_counter} semester.")
            if semester_counter == 0:
                print(
                    f"\t\t\033[93m\033[1mWARNING:\033[0m Was not possible to find out \033[4m{subject_name}\033[0m's semester. Using 0 as default.")
            if subject_id == 0:
                print(
                    f"\t\t\033[93m\033[1mWARNING:\033[0m Was not possible to find out \033[4m{subject_name}\033[0m's subject ID. Using 0 as default.")
            # =====================

            if str(subject_id) in short_names.keys():
                short_name = short_names[str(subject_id)]["short_name"]
            else:
                short_name = "".join(
                    [unidecode(word[0]) for word in subject_name.split(" ") if word[0].isupper()])
                print(
                    f"\t\t\033[93m\033[1mWARNING:\033[0m Was not possible to find out \033[4m{subject_name}\033[0m's short name. Using initials to generate one ({short_name}).")

            if subject_id in subjects_ids_control:
                continue
            elif subject_id != 0:
                subjects_ids_control.append(subject_id)

            subjects.append({
                # filterId
                "id": int(f"{year_counter}{semester_counter}{filter_id_counter}"),
                "subjectId": subject_id,
                "name": subject_name,
                "short_name": short_name,
                "year": year_counter,
                "semester": semester_counter
            })

            filter_id_counter += 1

    return subjects


def get_subject_codes_from_file():
    subjects_file = open(path.join("scraper", "subjects.json"), "r", encoding="utf-8")

    subjects = json.load(subjects_file)
    subject_codes = {}
    for subject in subjects:
        subject_codes[subject["name"].lower()] = {
            "id": subject["subjectId"],
            "filterId": subject["id"]
        }

    subjects_file.close()

    return subjects, subject_codes


def click_on_element(driver: WebDriver, element: WebElement):
    """
    Workaround to selenium.common.exceptions.ElementNotInteractableException.

    Parameters
    ----------
    driver : WebDriver
    The selenium driver.

    element : WebElement
    The selenium element to be clicked.
    """
    driver.execute_script("arguments[0].click();", element)


def get_future_element_with_timeout(driver: WebDriver | WebElement, css_query: str, timeout: int = 3, exit_on_timeout=True):
    """
    Returns a WebElement that will be created, in the future, on the DOM. Exists after a timeout. 

    Parameters
    ----------
    driver : WebDriver | WebElement
    The selenium driver or element.

    css_query : string
    The css query to select the web element.

    timeout : int
    How long takes the function to give up and exit the program if not found an element.

    exit_on_timeout : bool
    After the timeout it should exit the script or return None

    Returns
    -------
    WebElement | None | exit()
    """

    ignored_exceptions = (NoSuchElementException,
                          StaleElementReferenceException)
    try:
        element = WebDriverWait(driver, timeout, ignored_exceptions=ignored_exceptions)\
            .until(presence_of_element_located((By.CSS_SELECTOR, css_query)))

    except TimeoutException:
        if exit_on_timeout:
            print(
                f"Future Element '{css_query}' did not appear after {timeout} seconds.")
            print("Exiting ...")
            exit()
        else:
            return None

    return element

def wait_until_element_text_updates_with_timeout(driver: WebDriver | WebElement, css_query: str, previous_value: str, value_can_be_empty = False, timeout: int = 3, frequency = 0.5, exit_on_timeout=True):
    """
    Returns when the element's innerText update.

    Parameters
    ----------
    driver : WebDriver | WebElement
    The selenium driver or element.

    css_query : string
    The css query to select the web element.

    previous_value : int
    The initial value of the element's innerText.

    value_can_be_empty : bool
    The innerText can be ""?
    
    timeout : int
    How long takes the function to give up and exit the program if not found an element.

    frequency : int
    How much time takes between each check for the update

    exit_on_timeout : bool
    After the timeout it should exit the script or return None

    Returns
    -------
    WebElement | None | exit()
    """

    waited_time = 0

    while waited_time + frequency < timeout:
        waited_time += frequency

        try:
            element = driver.find_element(By.CSS_SELECTOR, css_query)

            if element.text != previous_value and (element.text != "" or value_can_be_empty):
                return True
        
        except StaleElementReferenceException:
            continue
        
        sleep(frequency)
        
    if exit_on_timeout:
        print(f"\nElement's innerText didn't changed after {timeout} seconds.")
        print("Exiting ...")
        exit()
    else:
        return False
