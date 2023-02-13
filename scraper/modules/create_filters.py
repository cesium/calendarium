from re import split

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
    
    # Ordering shifts by number
    subject_shifts = sorted(subject_shifts, key=lambda shift: int(split('(\d+)', shift)[1]))
    # Ordering shifts by letters
    subject_shifts = sorted(subject_shifts, key=lambda shift: split('(\d+)', shift)[0])
    # Ordering shifts by type (theoretical first)
    theoretical_shifts = [shift for shift in subject_shifts if shift[0] == "T" and shift[1].isnumeric()]
    subject_shifts = [shift for shift in subject_shifts if shift not in theoretical_shifts]

    subject_shifts = theoretical_shifts + subject_shifts

    filters.append({
    "id": subject["id"],
    "name": subject["short_name"],
    "groupId": subject["year"],
    "semester": subject["semester"],
    "shifts": subject_shifts
  })

  filters = [{
    "id": 0,
    "name": "CeSIUM",
    "groupId": 0,
    "semester": 0
  },
  {
    "id": 1,
    "name": "UMinho",
    "groupId": 0,
    "semester": 0
  },
  {
    "id": 2,
    "name": "SEI",
    "groupId": 0,
    "semester": 0
  }] + filters
    
  return filters
