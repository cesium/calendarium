from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.common.by import By

from modules.increment_time import increment_time, Time

def schedule_scraper(driver: WebDriver, subject_codes: list[dict[str, int]]):
  """
  Scrape the UM schedule of a given driver.
  Warning: the schedule need be already on the page.

  Parameters
  ----------
  driver : WebDriver
    The selenium driver. Need have the schedule ready

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

  classes = []

  cell_height = driver.find_element(By.CSS_SELECTOR, '.rsContentTable tr').size["height"]

  first_hour_on_schedule = driver.find_element(By.CSS_SELECTOR, '.rsVerticalHeaderTable tbody tr th div').text.split(':')
  first_time: Time = {
    "hour": int(first_hour_on_schedule[0]),
    "minute": int(first_hour_on_schedule[1])
  }

  extracted_rows = driver.find_elements(By.CSS_SELECTOR, '.rsContentTable tr')

  for row_index, row in enumerate(extracted_rows):
    # elapsed time in minutes = index * 30 -> each row is a 30 min block
    start_time = increment_time(first_time, row_index * 30)

    extracted_columns = row.find_elements(By.CSS_SELECTOR, 'td')

    for column_index, column in enumerate(extracted_columns):
      weekday = column_index

      extracted_classes = column.find_elements(By.CSS_SELECTOR, '.rsApt')

      for class_container in extracted_classes:
        class_info = class_container.find_elements(By.CSS_SELECTOR, '.rsAptContent')

        if len(class_info) == 0:
          continue

        subject, location, shift = class_info[0].text.split('\n')

        if subject.lower() in subject_codes.keys():
          subject_ids = subject_codes[subject.lower()]
        else:
          print(f"\t\033[93m\033[1mWARNING:\033[0m {subject} isn't present on scraper/subjects.json. Using default values")
          subject_ids = {
            "id": 0,
            "filterId": 0
          }
        
        duration_in_minutes = ((class_container.size["height"] + 4) / cell_height) * 30
        end_time = increment_time(start_time, duration_in_minutes)

        shift_type = "".join([char for char in shift if char.isalpha()])

        _, build, room = location.removeprefix("[").removesuffix("]").split(" - ")
        build_number = build.split(' ')[1]

        if int(build_number) <= 3:
          build_number = "CP" + build_number

        start_time_string = f"{start_time['hour']:02}:{start_time['minute']:02}"
        end_time_string = f"{end_time['hour']:02}:{end_time['minute']:02}"

        classes.append({
          "id": subject_ids["id"],

          "title": subject,

          "theoretical": shift_type.upper() == "T",

          "shift": shift,

          "building": build_number,
          "room": f"{room}",

          "day": weekday,

          "start": start_time_string,
          "end": end_time_string,

          "filterId": subject_ids["filterId"]
        })

  return classes