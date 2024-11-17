import { Modal, Box, Typography, Fade, Backdrop } from "@mui/material";

import { useState, useEffect, useCallback } from "react";

import { Collapse } from "antd";

import { IFilterDTO } from "../../dtos";
import { useAppInfo } from "../../contexts/AppInfoProvider";

type CalendarExportModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const CalendarExportModal = ({
  isOpen,
  setIsOpen,
}: CalendarExportModalProps) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [URL, setURL] = useState<string>("");
  const info = useAppInfo();
  const filters = info.filters as IFilterDTO[];

  const generateURL = useCallback((): string => {
    // checks if a filter exists for each filterId in checkedEvents
    function clearUnvalidEventItems(checkedEvents: number[]) {
      const validEvents = checkedEvents.filter((id) =>
        filters.find((f) => f.id === id)
      );
      localStorage.setItem("checked", JSON.stringify(validEvents));

      return validEvents;
    }

    // checks if a filter exists for each filterId in checkedShifts
    // and if the shift exists for that filter.
    function clearUnvalidShiftItems(
      checkedShifts: { id: number; shift: string }[]
    ) {
      const validShifts = checkedShifts.filter((shift) => {
        const filter = filters.find((f) => f.id === shift.id);
        return filter && filter.shifts.includes(shift.shift); // filter must include the shift
      });
      localStorage.setItem("shifts", JSON.stringify(validShifts));

      return validShifts;
    }

    const domain = process.env.NEXT_PUBLIC_DOMAIN;
    const baseURL: string =
      domain + "/api/export/" + (info.isEvents ? "events" : "schedule") + "?";

    var query: string = "";
    if (info.isEvents) {
      // fecth checked events from localStorage
      const checkedEvents: number[] = JSON.parse(
        localStorage.getItem("checked")
      );

      // if there are no checked events, return empty string (empty URL => warning message on modal)
      if (!checkedEvents || checkedEvents.length === 0) return "";

      // clear unvalid events from checkedEvents
      const validCheckedEvents = clearUnvalidEventItems(checkedEvents);

      // if the resulting valid events array is empty, return empty string (empty URL => warning message on modal)
      if (validCheckedEvents.length === 0) return "";

      // convert event ids to event names
      const checkedEventsNames: string[] = validCheckedEvents.map(
        (filterId) => {
          return filters.find((f) => f.id === filterId).name;
        }
      );

      // build query string
      query = checkedEventsNames.join("&");
    } else {
      // helps format each shift parameter
      const toString = (shift: { name: string; shift: string }) => {
        return `${shift.name}=${shift.shift}`;
      };

      // fetch checked shifts from localStorage
      const checkedShifts: { id: number; shift: string }[] = JSON.parse(
        localStorage.getItem("shifts")
      );

      // if there are no checked shifts, return empty string (empty URL => warning message on modal)
      if (!checkedShifts || checkedShifts.length === 0) return "";

      // clear unvalid shifts from checkedShifts
      const validCheckedShifts = clearUnvalidShiftItems(checkedShifts);

      // if the resulting valid shifts array is empty, return empty string (empty URL => warning message on modal)
      if (validCheckedShifts.length === 0) return "";

      // convert shift ids to shift names
      const checkedShiftsNames: { name: string; shift: string }[] =
        validCheckedShifts.map((shift) => {
          const name = filters.find((f) => f.id === shift.id).name;

          return {
            name: name,
            shift: shift.shift,
          };
        });

      // build query string
      query = `${checkedShiftsNames.map((shift) => toString(shift)).join("&")}`;
    }

    // at this point, 'query' is hopefully always a valid query string (function has returned if it wasn't)
    // still, in an edge case of an empty 'query' string, return empty string (empty URL => warning message on modal)
    if (query !== "") return baseURL + query;
    else return "";
  }, [info.isEvents, filters]);

  useEffect(() => {
    setURL(generateURL());
  }, [generateURL, isOpen]);

  function copyToClipboard() {
    navigator.clipboard.writeText(URL);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1000);
  }

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 400 } }}
      >
        <Fade in={isOpen} timeout={400}>
          <Box
            className="absolute left-1/2 top-1/2 h-fit w-full -translate-x-1/2 -translate-y-1/2 transform overflow-y-auto rounded-2xl border bg-white p-6 text-center shadow-xl dark:border-neutral-400/20 dark:bg-neutral-800 sm:w-96"
            style={{
              maxHeight: "calc(100% - 4rem)",
              maxWidth: "calc(100% - 4rem)",
            }}
          >
            <div className="w-full space-y-4 font-display">
              <span
                id="modal-modal-title"
                className="select-none text-xl font-medium"
              >
                Export by URL <i className="bi bi-link-45deg"></i>
              </span>
              {URL === "" ? (
                <div id="modal-modal-description" className="text-center">
                  <i className="bi bi-exclamation-circle-fill text-error"></i>{" "}
                  {info.isEvents
                    ? "Select at least one subject."
                    : "Select at least one shift."}
                </div>
              ) : (
                <div className="space-y-4">
                  <span id="modal-modal-description">
                    <div>
                      <div className="flex w-full rounded-lg shadow-sm">
                        <div
                          className="relative flex flex-grow items-stretch focus-within:z-10"
                          style={{ width: "calc(100% - 38px)" }}
                        >
                          <div className="block w-full rounded-none rounded-l-lg border-0 py-1.5  ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-inset focus:ring-cesium-900 dark:ring-neutral-400/30 sm:text-sm sm:leading-6">
                            <div className="mx-2 overflow-y-hidden overflow-x-scroll whitespace-nowrap text-start">
                              {URL}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          title={isCopied ? "Copied" : "Copy"}
                          className="relative -ml-px inline-flex w-[38px] place-content-center items-center gap-x-1.5 rounded-r-lg px-3 py-2 text-sm font-semibold  ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 dark:ring-neutral-400/30 dark:hover:bg-neutral-400/10"
                          onClick={copyToClipboard}
                        >
                          {isCopied ? (
                            <i className="bi bi-check-circle-fill text-cesium-900" />
                          ) : (
                            <i className="bi bi-copy" />
                          )}
                        </button>
                      </div>
                    </div>
                  </span>
                  <Collapse className="w-full rounded-lg border-neutral-300 bg-white text-left font-display shadow-sm dark:border-neutral-400/30">
                    <Collapse.Panel header="How does it work?" key="1">
                      <div className="text-justify">
                        <p>
                          The URL above allows you to{" "}
                          <a className="font-medium">subscribe</a> to your
                          active{" "}
                          <a className="font-medium">
                            {info.isEvents ? "events" : "schedule"}
                          </a>{" "}
                          in Calendarium, using your favorite calendar app.
                        </p>
                        <p>
                          This means that you will be able to see your{" "}
                          {info.isEvents ? "events" : "schedule"} in your
                          calendar app, and add event notifications, change
                          colors and make other customizations.
                        </p>
                        <p>
                          Your {info.isEvents ? "events" : "schedule"} will be
                          automatically synced with Calendarium.
                        </p>
                        <p className="rounded-lg bg-blue-500/20 p-3">
                          <i className="bi bi-info-circle-fill text-blue-500"></i>{" "}
                          To export your{" "}
                          <a className="font-medium">
                            {info.isEvents ? "schedule" : "events"}
                          </a>{" "}
                          please navigate to{" "}
                          {info.isEvents ? "/schedule" : "the main page"}.
                        </p>
                        <div className="rounded-lg bg-warning/20 p-3">
                          <i className="bi bi-exclamation-triangle-fill text-warning"></i>{" "}
                          If you make any changes to your{" "}
                          {info.isEvents ? "events" : "schedule"} in
                          Calendarium, you
                          {"'"}ll need to{" "}
                          <a className="font-medium">
                            re-export and re-subscribe to the calendar
                          </a>
                          .
                        </div>
                      </div>
                    </Collapse.Panel>
                  </Collapse>
                  <Collapse
                    accordion
                    className="w-full rounded-lg border-neutral-300 bg-white text-left font-display shadow-sm"
                  >
                    <Collapse.Panel header="Google Calendar" key="1">
                      <div className="">
                        <ol className="ml-6 list-decimal">
                          <li>
                            On your computer, open{" "}
                            <a
                              href="https://calendar.google.com"
                              className="text-blue-500"
                            >
                              Google Calendar{" "}
                              <i className="bi bi-box-arrow-up-right"></i>
                            </a>
                            .
                          </li>
                          <li>
                            On the left, next to {'"Other calendars"'}, click
                            Add <i className="bi bi-plus"></i>{" "}
                            <i className="bi bi-chevron-right"></i>{" "}
                            <span className="font-medium">From URL</span>.
                          </li>
                          <li>Enter the above calendar{"'"}s address.</li>
                          <li>
                            Click <a className="font-medium">Add calendar</a>.
                            The calendar appears on the left, under{" "}
                            {'"Other calendars"'}.
                          </li>
                        </ol>
                        <a
                          href="https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform=Desktop"
                          className="text-blue-500"
                        >
                          Know more <i className="bi bi-box-arrow-up-right"></i>
                        </a>
                      </div>
                    </Collapse.Panel>
                    <Collapse.Panel header="Apple Calendar" key="2">
                      <div className="">
                        <ol className="ml-6 list-decimal">
                          <li>
                            On your iPhone, open{" "}
                            <a className="font-medium">Calendar</a>.
                          </li>
                          <li>On the bottom, click {'"Calendars"'}.</li>
                          <li>
                            On the bottom left, click {'"Add Calendar"'}{" "}
                            <i className="bi bi-chevron-right"></i>{" "}
                            <a className="font-medium">
                              Add Subscription Calendar
                            </a>
                            .
                          </li>
                          <li>Enter the above calendar{"'"}s address.</li>
                          <li>
                            Click <a className="font-medium">Subscribe</a>. The
                            calendar appears under {'"Calendars"'}.
                          </li>
                        </ol>
                        <i className="bi bi-lightbulb"></i> You can also{" "}
                        <a
                          href="https://support.apple.com/guide/calendar/subscribe-to-calendars-icl1022/mac"
                          className="text-blue-500"
                        >
                          use your Mac{" "}
                          <i className="bi bi-box-arrow-up-right"></i>
                        </a>
                      </div>
                    </Collapse.Panel>
                    <Collapse.Panel header="Outlook Calendar" key="3">
                      <div className="">
                        <ol className="ml-6 list-decimal">
                          <li>
                            Sign in to{" "}
                            <a
                              href="https://go.microsoft.com/fwlink/p/?linkid=843379"
                              className="text-blue-500"
                            >
                              Outlook.com{" "}
                              <i className="bi bi-box-arrow-up-right"></i>
                            </a>
                          </li>
                          <li>
                            At the bottom of the page, select the calendar icon.
                          </li>
                          <li>
                            In the navigation pane, select{" "}
                            <a className="font-medium">Add Calendar</a>.
                          </li>
                          <li>
                            Select{" "}
                            <a className="font-medium">Subscribe from web</a>.
                          </li>
                          <li>Enter the above calendar{"'"}s address.</li>
                          <li>
                            Select <a className="font-medium">Import</a>.
                          </li>
                        </ol>
                        <a
                          href="https://support.microsoft.com/en-gb/office/import-or-subscribe-to-a-calendar-in-outlook-com-cff1429c-5af6-41ec-a5b4-74f2c278e98c"
                          className="text-blue-500"
                        >
                          Know more <i className="bi bi-box-arrow-up-right"></i>
                        </a>
                      </div>
                    </Collapse.Panel>
                  </Collapse>
                  <div className="cursor-pointer select-none text-sm text-neutral-500 dark:text-neutral-400">
                    {info.isEvents ? (
                      <div title="To export your schedule please go to /schedule.">
                        <i className="bi bi-info-circle-fill"></i> Currently
                        exporting your visible{" "}
                        <a className="font-medium">events</a>
                      </div>
                    ) : (
                      <div title="To export your events please go to the main page.">
                        <i className="bi bi-info-circle-fill"></i> Currently
                        exporting your <a className="font-medium">schedule</a>
                      </div>
                    )}
                  </div>

                  <div className="cursor-pointer select-none text-sm text-neutral-500 dark:text-neutral-400">
                    <i className="bi bi-lightbulb"></i> You can also{" "}
                    <a className="font-medium text-blue-400" href={URL}>
                      download as .ics file
                    </a>
                  </div>
                </div>
              )}
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default CalendarExportModal;
