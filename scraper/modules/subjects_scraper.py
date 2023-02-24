#!/usr/bin/python

from selenium.webdriver.remote.webdriver import WebDriver, WebElement
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException, StaleElementReferenceException, TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.expected_conditions import presence_of_element_located

import json
from time import sleep
from unidecode import unidecode

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

    try:  
        subjects_short_names = json.load(open('scraper/subjects_short_names.json'))
    except FileNotFoundError:
        print("\nFile `scraper/subjects_short_names.json` doesn't exists.")
        print("Read more about at 'scraper/subjects_short_names_scraper/README.md'")
        exit()

    try:  
        subjects, subject_codes = get_subject_codes_from_file()
        print("\n-> Using subject codes from `subjects.json`")
        return subjects, subject_codes
    except FileNotFoundError:
        pass
    
    print("\nRunning subjects scraper: ====")
    
    print("\nWelcome to UMinho Subjects Scraper!")
    
    print("\nRead about 'Subject IDs and Filter Ids' or `subjects_scraper` on documentation")

    print("\n\033[1mScraping subjects from Licenciatura em Engenharia Informática\033[0m:")
    subjects = scraper(driver, "Licenciatura em Engenharia Informática", subjects_short_names)

    print("\n\033[1mScraping subjects from Mestrado em Engenharia Informática\033[0m:")
    subjects += scraper(driver, "Mestrado em Engenharia Informática", subjects_short_names, master=True)

    with open("scraper/subjects.json", "w") as outfile:
        json.dump(subjects, outfile, indent=2, ensure_ascii=False)

    print(f"\nDone. Scraped {len(subjects)} subjects from the UMinho page!")
    print(f"Check them at scraper/subjects.json\n")

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
    driver.get(f"https://www.uminho.pt/PT/ensino/oferta-educativa/paginas/{endpoint}.aspx")

    # search courses input
    driver.find_element(By.CSS_SELECTOR, "input.form-control") \
        .send_keys(course_name.removeprefix("Licenciatura em ").removeprefix("Mestrado em ").removeprefix("Mestrado Integrado em "))
    
    # search button
    driver.find_element(By.CSS_SELECTOR, ".input-group-addon").click()

    courses_pickers = driver.find_elements(By.CSS_SELECTOR, "div.row td .noshow")

    for picker in courses_pickers:
        if course_name in picker.text:
            click_on_element(driver, picker)
    
    
    sleep(2) # Some JS should be running, and we need wait

    tabs_available = driver.find_elements(By.CSS_SELECTOR, "ul.nav.nav-tabs li")
    for tab in tabs_available:
        if tab.text == "Plano de Estudos":
            tab.click()
    
    subjects_trs_amount = len(driver.find_elements(By.CSS_SELECTOR, ".col-md-12 tbody tr"))

    subjects = []
    year_counter = 1
    semester_counter = 1
    filter_id_counter = 1

    for i in range(0, subjects_trs_amount):
        subject = driver.find_elements(By.CSS_SELECTOR, ".col-md-12 tbody tr")[i]

        subject_info = subject.find_elements(By.CSS_SELECTOR, "td")

        if len(subject_info) == 2: # header
            year_span = subject_info[0].find_element(By.CSS_SELECTOR, "span")
            year_counter = int(year_span.text.removeprefix("Ano ")) + (3 if master else 0)

        elif len(subject_info) == 4: # subject
            semester_string = subject_info[0].text.removeprefix("S")

            if semester_string.isnumeric():
                semester_counter = int(semester_string)
            elif semester_string != "":
                semester_counter = 0
            
            if subject_info[2].text == "":
                # Opção UMinho / de mestrado
                continue
            
            if subjects != [] and (subjects[-1]["semester"] != semester_counter or subjects[-1]["year"] != year_counter):
                filter_id_counter = 1
            
            subject_name = subject_info[1].text
            
            # Getting subjectId ===
            more_info_button = get_future_element_with_timeout(subject_info[1], "a", exit_on_timeout=False)
            if more_info_button:
                click_on_element(driver, more_info_button)

                sleep(1)
                subject_id_span = driver.find_element(By.CSS_SELECTOR, ".modal-content .row .col-md-10 span")
                subject_id = subject_id_span.text or 0

                close_button = driver.find_element(By.CSS_SELECTOR, ".close")
                click_on_element(driver, close_button)
            else:
                subject_id = 0
            
            if filter_id_counter == 1:
                print(f"\n\tScraping subjects from {year_counter} year and {semester_counter} semester.")
            if semester_counter == 0:
                print(f"\t\t\033[93m\033[1mWARNING:\033[0m Was not possible to find out \033[4m{subject_name}\033[0m's semester. Using 0 as default.")
            if subject_id == 0:
                print(f"\t\t\033[93m\033[1mWARNING:\033[0m Was not possible to find out \033[4m{subject_name}\033[0m's subject ID. Using 0 as default.")
            # =====================

            if subject_id in short_names.keys():
                short_name = short_names[subject_id]["short_name"]
            else:
                short_name = "".join([unidecode(word[0]) for word in subject_name.split(" ") if word[0].isupper()])
                print(f"\t\t\033[93m\033[1mWARNING:\033[0m Was not possible to find out \033[4m{subject_name}\033[0m's short name. Using initials to generate one ({short_name}).")

            subjects.append({
                "id": int(f"{year_counter}{semester_counter}{filter_id_counter}"), # filterId
                "subjectId": int(subject_id),
                "name": subject_name,
                "short_name": short_name,
                "year": year_counter,
                "semester": semester_counter
            })

            filter_id_counter += 1

    return subjects

def  get_subject_codes_from_file():
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

def get_future_element_with_timeout(driver: WebDriver | WebElement, css_query: str, timeout: int = 3, exit_on_timeout = True):
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

    ignored_exceptions=(NoSuchElementException,StaleElementReferenceException)
    try:
        element = WebDriverWait(driver, timeout, ignored_exceptions=ignored_exceptions)\
                    .until(presence_of_element_located((By.CSS_SELECTOR, css_query)))
        
    except TimeoutException:
        if exit_on_timeout:
            print(f"Future Element '{css_query}' did not appear after {timeout} seconds.")
            print("Exiting ...")
            exit()
        else:
            return None

    return element
