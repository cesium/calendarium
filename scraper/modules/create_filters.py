import re


def create_filters(shifts: list[dict], subjects: list[dict]):
    """
    Generate the filters.json to Calendarium.

    Parameters
    ----------
    shifts : list[dict]
      The shifts list.

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

    subjects : list[dict]
      The subjects list.

      [{
        "id": int, # filterId
        "subjectId": int, 
        "name": string,
        "short_name": string,
        "year": int,
        "semester": int
      }]

    Returns
    -------
    [{
      "id": int,
      "name": str,
      "groupId": int,
      "semester": int,
      "shifts": [str]
    }]
    """

    filters = []

    for subject in subjects:
        subject_shifts = []

        for shift in shifts:
            if shift["filterId"] == subject["id"] and shift["shift"] not in subject_shifts:
                subject_shifts.append(shift["shift"])

        theoretical_shifts = [shift for shift in subject_shifts if shift.startswith('T') and not shift.startswith('TP')]
        theoretical_shifts.sort(key=extract_number)

        practical_shifts = [shift for shift in subject_shifts if shift.startswith('TP') or shift.startswith('PL') or shift.startswith('OT')]
        practical_shifts.sort(key=extract_number)

        subject_shifts = theoretical_shifts + practical_shifts

        filters.append({
            "id": subject["id"],
            "name": subject["short_name"],
            "groupId": subject["year"],
            "semester": subject["semester"],
            "shifts": subject_shifts
        })

    return filters

def extract_number(shift):
  m = re.search(r'\d+', shift)
  # T with no number goes first, thus the -inf
  return int(m.group()) if m else float('-inf')
