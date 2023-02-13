from math import floor

Time = dict[str, int]

def increment_time (initial_time: Time, elapsed_time_in_minutes: int) -> Time:
  """
  Sum the elapsed time in minutes to the initial time.

  Parameters
  ----------
  initial_time: Time
    The initial time

  elapsed_time_in_minutes: int
    How many time in minutes elapsed since the initial time.

  Returns
  -------
  {
    "hour": ...,
    "minute": ...
  }
  """

  final_time_in_minutes = (initial_time["hour"] * 60 + initial_time["minute"]) + elapsed_time_in_minutes

  return {
    "hour": int(floor(final_time_in_minutes / 60)),
    "minute": int(final_time_in_minutes % 60)
  }