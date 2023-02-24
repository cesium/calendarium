## Subjects Short Name

On [Calendarium](https://calendario.cesium.di.uminho.pt/) some subjects have a short name.
This short names were created on a previous manual scrap from the schedule, and now, for this Python scrap, we need a JSON file with the short name for each subject.

### Scraping this values

The scrap can be done combining the files `data/filter.json` and `data/shifts.json` from a specific commit (when this files were a manual scrap) from Calendarium's GitHub repository.

### Adding manual values

If for some reason you want add some subjects to this scrap, you can edit the dictionary `manual_subject_names` at `scraper/subjects_short_names_scraper/main.py` file. Follow the next schema:

```python
manual_subject_names = {
  str: { # subject Id 
    "name": str, # complete name
    "short_name": # short name
  }
}
```

#### Running

The scrap will be stored at `scraper/subjects_short_names.json`. This file is required by schedule scraper, but it should already be available from the GitHub clone.

```bash
$ python scraper/subjects_short_names_scraper/main.py
```