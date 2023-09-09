<h1 align="center">
  <a href="https://calendario.cesium.di.uminho.pt/" title="Go to Calendarium">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="assets/calendarium-banner-dark.png">
      <source media="(prefers-color-scheme: light)" srcset="assets/calendarium-banner-light.png">
      <img alt="Calendarium" height="auto" width="800px">
    </picture>
  </a>
</h1>

[netlify-status]: https://app.netlify.com/sites/cesium-calendarium/deploys

> 📅 Calendar with special events, due dates and week schedule

Exams, projects, events and schedules. Your hub to everything LEI, MEI or even MIEI!

Anything out of place? Give us your feedback using the [Suggestions Form](https://forms.gle/C2uxuUKqoeqMWfcZ6)!

You can also fix it yourself following our [Helping Guide](HELPING_GUIDE.md) ;)

## 🤝 Contributing

When contributing to this repository, please first discuss the change you wish to make via discussions, issue, email, or any other method with the owners of this repository before making a change.

Please note we have a [Code of Conduct](CODE_OF_CONDUCT.md), please follow it in all your interactions with the project.

We have a [Contributing Guide](CONTRIBUTING.md) to help you getting started.

## 📑 Features

> Here's a quick view of the features you can expect

### Multiple calendar views

- Day
- Week
- Month

### Event & Schedule filtering

See only the activities that matter to you

### Filter Memorization

Find your selected Schedule and Events always there for you, even if you leave or refresh the page

### Clear Schedule

New schedule? Clear all your choices with one click and start again

### Export to PDF

Export your calendar or schedule into PDF format

### Notifications

Get updated on the latest changes to the platform and know when new information is added

### Color Themes

Customize your calendar view with a choice of themes or create your own!

### Export to Calendar

Export your events and schedule into your favorite calendar app, from Google Calendar to Apple Calendar!

## 🔌 Calendar Export API

> Understand how our Export API works, and what you can do with it

### API Endpoints

There are two endpoints you can work with: `/api/export/events` and `/api/export/schedule`.

**1. `/events`**

This endpoint is responsible for generating a .ics (iCal) file containing events from the "Events" page. It should receive a list of subjects in their short form, similarly to how subjects are displayed in the filters of Calendarium, joined by `&`.

Check out this example, where we ask the API to generate a file containing the events from the 2nd year / 2nd semester subjects of LEI:

```
https://calendario.cesium.di.uminho.pt/api/export/events?BD&IO&MNOnL&POO&RC&SO
```

> **Note**  
> Only the events relevant to the current academic year will be exported. A request with wrongly formatted parameters or subjects that don't exist, will be answered with a "400 Invalid Request" error message.

**2. `/schedule`**

This endpoint is responsible for generating a .ics (iCal) file containing shifts from the "Schedule" page, which will have a weekly recurrence rule. It should receive a list of subject-shift pairs, joined by `&`. Similarly to what happens in `/events`, the subject should be represented in its short form. As for the shift, it should be in accordance with the shifts displayed in the filters of Calendarium.

Check out this example, where we ask the API to generate a file containing a possible schedule for the 3rd year / 1st semester of LEI:

```
https://calendario.cesium.di.uminho.pt/api/export/schedule?
CP=T1&CP=TP1&CC=T1&CC=PL1&DSS=T1&DSS=PL1&IA=T1&IA=PL1&LI4=T1&LI4=OT1&SD=T1&SD=PL1
```

> **Note**  
> A request with wrongly formatted parameters, or subjects and shifts that don't exist, will be answered with a "400 Invalid Request" error message.
