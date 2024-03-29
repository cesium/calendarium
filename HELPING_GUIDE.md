# 📬 Helping Guide

> Anything wrong or missing? Learn how to help Calendarium!

## 🖇️ Forking the repository

**1.** Go to [Calendarium](https://github.com/cesium/calendarium)

**2.** In the top right corner, click on **Fork**

## 🔗 Cloning the forked repository to your machine

**1.** Go to _your fork_ and click **Code**

> **Note**  
> The link to your forked repository should be `https://github.com/<your-username>/calendarium`

**2.** Copy the given HTTPS link

**3.** On your terminal, run the following command:

```
git clone <https-link>
```

> **Note**  
> If you'd rather clone with SSH, copy the SSH url and run `git clone <ssh-url>`

**Now you have a copy of the repository that you can work with.**

> **Note**  
> The following instructions are targeted for a Linux environment, you can however use the web-based editing capabilities of GitHub.

## ⛓️ Creating a branch

**1.** Move to your cloned repository directory with `cd calendarium`

**2.** Create a new branch with the following command:

```
git checkout -b <branch>
```

Where `<branch>` is the name of your branch.

> **Note**  
> The name of your branch should follow the CeSIUM guidelines: `<first-letter-of-your-first-name><first-letter-of-your-last-name> + '/' + <branch-name>`.
> For example: `dm/shifts`.

## 🗃️ Making your changes

**1.** Move to the `data` directory

**2.** Open the `events.json` or `shifts.json` to make changes to **Events** or **Shifts**

**Understanding `events.json`**

- `title` - event title
- `place` - where the event takes place _(optional)_
- `link` - a relevant link _(optional)_
- `start` - **date and time** of when the event starts
- `end` - **date and time** of when the event ends
- `groupId` - an ID composed of the course year
- `filterId`\* - an ID used for filtering

> **Note**  
> The `filterId` is composed of: `<course-year><course-semester><curricular-unit-number>`.
> For example: `221` (Bases de Dados).
> Check out the `filterId` of each class by searching its name on `shifts.json` or checking the `id` parameter in `filters.json`.

> **Note**
> For all-day events, `start` and `end` should be equal and composed of: `<event-date> 00:00`. And for multiple-days events: `start: <event-start-date> 00:00` & `end: <event-end-date> 23:59`. Check out the example below.

Check out this example:

```json
{
  "title": "[Lógica] Teste",
  "place": "CP2 - 0.20 + 1.01 + 1.05 + 1.07 + 2.01 + 2.02",
  "start": "2023-04-12 17:30",
  "end": "2023-04-12 20:30",
  "groupId": 1,
  "filterId": 124
}
```

For All-Day events:

```json
{
  "title": "[POO] Entrega TP",
  "start": "2023-05-14 00:00",
  "end": "2023-05-14 00:00",
  "groupId": 2,
  "filterId": 224
}
```

For Multiple-Days events:

```json
{
  "title": "[POO] Apresentação TP",
  "start": "2023-05-15 00:00",
  "end": "2023-05-19 23:59",
  "groupId": 2,
  "filterId": 224
}
```

**Understanding `shifts.json`**

- `id`\* - curricular unit id
- `title` - title of the activity
- `theoretical` - 'true' for T and 'false' for TP
- `shift` - class shift
- `building`\* - building where the class takes place
- `room` - room where the class takes place
- `day` - week day (1 - Monday ... 4 - Friday)
- `start` - **time** of when the activity starts
- `end` - **time** of when the activity ends
- `filterId`\* - an ID used for filtering

> **Note**  
> The curricular unit `id` is taken from the official UMinho Software Engineering Study Plan, available [here](https://www.uminho.pt/PT/ensino/oferta-educativa/_layouts/15/UMinho.PortalUM.UI/Pages/CatalogoCursoDetail.aspx?itemId=4346&catId=13). However, you should not have to change it.

> **Note**  
> The `building` parameter should be composed of `CP` + `<building-number>` **only for buildings 1, 2 and 3**. For the remaining buildings it's simply composed of the building number.

> **Note**  
> The `filterId` is composed of: `<course-year><course-semester><curricular-unit-number>`.
> For example: `221` (Bases de Dados).
> Check out the `filterId` of each class by searching its name on `shifts.json` or checking the `id` parameter in `filters.json`.

Check out this example:

```json
{
  "id": 14296,
  "title": "Laboratórios de Informática II",
  "theoretical": false,
  "shift": "PL8",
  "building": "CP2",
  "room": "1.09",
  "day": 3,
  "start": "08:00",
  "end": "10:00",
  "filterId": 123
}
```

> **Note**  
> You can get a local preview of your changes by running the project on your machine, follow the [Contributing Guide](CONTRIBUTING.md) to know more.

## 🛫 Stage, commit and push your changes

**1.** Stage your changes:

```
git add .
```

**2.** Commit your changes:

```
git commit -m "<commit-description>"
```

**3.** Push your changes to your forked repository:

```
git push
```

## 🚀 Create a pull request

**1.** Go to your forked repository on the GitHub website

**2.** Select the branch you created from the dropdown menu

**3.** Click on **Pull request**

**4.** Add a convenient title and description to your pull request

**5.** Assign a contributor for review

## 🎉 You're done!

If everything checks out, your pull request will be reviewed and approved shortly.

Visit the [Calendarium](https://calendario.cesium.di.uminho.pt/) website and check out your changes!
