from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException

from modules.schedule_scraper import schedule_scraper

from time import sleep
from json import loads as json_loads


def course_scraper(driver: WebDriver, course_name: str, subject_codes: list[dict[str, int]]):
    """
    Scrape schedules of every years and semesters of a course.
    Warning: the driver need be already on the UM schedule page on the correct course.

    Parameters
    ----------
    driver : WebDriver
      The selenium driver.

    course_name : str
      The name of the course to scrape.
      Should be equal to the ones that are on the course picker.

    subject_codes : list[dict[str, int]]
      Every subject has its subject ID and filter ID. This IDs are stored on a list of dicts with the format:

      [{
        "id": int,
        "filterId": int
      }]

    Returns
    -------
    [{
      "id": int,

      "title": str,

      "theoretical": bool,

      "shift": string,

      "building": string,
      "room": string,

      "day": int,

      "start": string,
      "end": string,

      "filterId": int
    }]
    """

    driver.get(
        "https://alunos.uminho.pt/PT/estudantes/Paginas/InfoUteisHorarios.aspx")

    course_arrow_picker = driver.find_element(
        By.ID, "ctl00_ctl40_g_e84a3962_8ce0_47bf_a5c3_d5f9dd3927ef_ctl00_dataCurso_Arrow")
    course_arrow_picker.click()

    sleep(1.5)  # Some JS should be running, and we need wait

    courses_pickers = driver.find_elements(By.CLASS_NAME, "rcbItem")

    for course in courses_pickers:
        if course_name in course.text:
            course.click()
            break

    try:
        plan_arrow_picker = driver.find_element(
            By.ID, "ctl00_ctl40_g_e84a3962_8ce0_47bf_a5c3_d5f9dd3927ef_ctl00_dataPlano_Arrow")
    except NoSuchElementException:
        plan_arrow_picker = None
    
    # Some courses don't have a plan picker, so we need to check if it exists before click on it
    if plan_arrow_picker is not None:
        plan_arrow_picker.click()

        sleep(1.5)  # Some JS should be running, and we need wait

        plans_pickers = driver.find_elements(By.CLASS_NAME, "rcbItem")

        plans_pickers[0].click()  # Click on the first plan, because the second one is empty

    # Show expanded Schedule
    driver.find_element(
        By.ID, "ctl00_ctl40_g_e84a3962_8ce0_47bf_a5c3_d5f9dd3927ef_ctl00_chkMostraExpandido").click()

    # An hidden input with a range dates for the calendar inputs in JSON format
    date_range = json_loads(driver.find_element(
        By.ID, "ctl00_ctl40_g_e84a3962_8ce0_47bf_a5c3_d5f9dd3927ef_ctl00_dataWeekSelect_dateInput_ClientState").get_attribute("value"))
    semesters_dates = {
        1: date_range["minDateStr"],
        2: date_range["maxDateStr"]
    }

    # The dates are hardcoded because some subjects aren't present on the first/last semester week
    semesters_dates[1] = f"{semesters_dates[1][0:5]}11-15{semesters_dates[1][10:]}"
    semesters_dates[2] = f"{semesters_dates[2][0:5]}03-15{semesters_dates[2][10:]}"

    amount_of_years_pickers = len(driver.find_elements(
        By.NAME, "ctl00$ctl40$g_e84a3962_8ce0_47bf_a5c3_d5f9dd3927ef$ctl00$dataAnoCurricular"))

    classes = []

    for i in range(0, amount_of_years_pickers):
        year_picker = driver.find_elements(
            By.NAME, "ctl00$ctl40$g_e84a3962_8ce0_47bf_a5c3_d5f9dd3927ef$ctl00$dataAnoCurricular")[i]

        university_year = int(year_picker.get_attribute("value"))
        year_picker.click()

        for semester_num, semesters_date in semesters_dates.items():
            date_input = driver.find_element(
                By.ID, "ctl00_ctl40_g_e84a3962_8ce0_47bf_a5c3_d5f9dd3927ef_ctl00_dataWeekSelect_dateInput")
            search_button = driver.find_element(
                By.ID, "ctl00_ctl40_g_e84a3962_8ce0_47bf_a5c3_d5f9dd3927ef_ctl00_btnSearchHorario")

            print(
                f"\tScraping schedule from {semester_num} semester of year {university_year} of course {course_name}")

            date_input.send_keys(semesters_date)
            search_button.click()

            try:
                new_classes_schedule = schedule_scraper(driver, subject_codes)
            except NoSuchElementException:
                print(f"\t\t\033[91m\033[1mWARNING:\033[0m Schedules not available for {semester_num} semester of year {university_year} ")
                new_classes_schedule = []
            
            classes += new_classes_schedule

    return classes
