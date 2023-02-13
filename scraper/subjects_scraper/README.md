# IDs Scraper

[Calendarium](https://calendario.cesium.di.uminho.pt/) uses a subject ID and a filterID. The first is given by the university, the second is calculated with:

```python
filterId = f"{university_year}{university_semester}{subject_code}"
```

Where the `subject code` is the position of the subject in an alphabetic ordered list. For example:

```python
# 1st year & 1st semester subjects:
["Álgebra", "Cálculo", "Tópicos Matemática"]
```

The `filterID` of `Tópicos Matemática` will be `113`.

## Scraping this values

On UMinho Courses pages, a list of all subjects, ordered first by year/semesters and next by alphabetic order, and the subject IDs are given. This is everything we need to complete `shifts.json` and generate a basic `filters.json` to Calendarium.

### Running

Just run the main script, that depends from this file, and it will be created.
The scrape will be stored at `data/filters.json`.
