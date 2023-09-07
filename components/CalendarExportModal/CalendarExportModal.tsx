import { Modal, Box, Typography, Fade, Backdrop } from "@mui/material";

import { useState, useEffect } from "react";

import { Collapse } from "antd";

import { IFilterDTO } from "../../dtos";

type CalendarExportModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isHome: boolean;
  filters: IFilterDTO[];
};

const CalendarExportModal = ({
  isOpen,
  setIsOpen,
  isHome,
  filters,
}: CalendarExportModalProps) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [URL, setURL] = useState<string>("");

  function generateURL(): string {
    const domain = process.env.NEXT_PUBLIC_DOMAIN;
    const baseURL: string =
      domain + "/api/export/" + (isHome ? "events" : "schedule") + "?";

    var queries: string = "";
    if (isHome) {
      const checkedEvents: number[] = JSON.parse(
        localStorage.getItem("checked")
      );

      if (checkedEvents && checkedEvents.length > 0) {
        const checkedEventsNames: string[] = checkedEvents.map((filterId) => {
          return filters.find((f) => f.id === filterId).name;
        });

        queries = checkedEventsNames.join("&");
      } else {
        return "";
      }
    } else {
      const checkedShifts: { id: number; shift: string }[] = JSON.parse(
        localStorage.getItem("shifts")
      );

      const toString = (shift: { name: string; shift: string }) => {
        return `${shift.name}=${shift.shift}`;
      };

      if (checkedShifts && checkedShifts.length > 0) {
        const checkedShiftsNames: { name: string; shift: string }[] =
          checkedShifts.map((shift) => {
            return {
              name: filters.find((f) => f.id === shift.id).name,
              shift: shift.shift,
            };
          });

        queries = `${checkedShiftsNames
          .map((shift) => toString(shift))
          .join("&")}`;
      } else {
        return "";
      }
    }

    return baseURL + queries;
  }

  useEffect(() => {
    setURL(generateURL());
  });

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
        slotProps={{ backdrop: { timeout: 300 } }}
      >
        <Fade in={isOpen}>
          <Box className="absolute left-1/2 top-1/2 h-fit max-h-full w-fit -translate-x-1/2 -translate-y-1/2 transform overflow-scroll rounded-3xl border bg-white p-6 text-center shadow-xl">
            <Typography
              id="modal-modal-title"
              className="select-none place-content-center items-center text-gray-900"
              variant="h6"
              component="h2"
            >
              Export by URL <i className="bi bi-link-45deg"></i>
            </Typography>
            {URL === "" ? (
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <div className="text-gray-900">
                  <div className="text-center">
                    <i className="bi bi-exclamation-circle-fill text-error"></i>{" "}
                    {isHome
                      ? "Select at least one subject."
                      : "Select at least one shift."}
                  </div>
                </div>
              </Typography>
            ) : (
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <div className="space-y-4">
                  <div>
                    <div className="w- mt-2 flex rounded-xl shadow-sm">
                      <div className="relative flex flex-grow focus-within:z-10">
                        <div className="whitespace-nowrap rounded-none rounded-l-xl border-0 px-3 py-1.5 text-left text-gray-900 ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6">
                          <div className="w-56 overflow-y-hidden overflow-x-scroll pb-2 lg:w-80">
                            {URL}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        title={isCopied ? "Copied" : "Copy"}
                        className="text-md relative -ml-px inline-flex w-full items-center gap-x-1.5 rounded-r-xl px-3 py-2 font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 transition-colors hover:bg-gray-100"
                        onClick={copyToClipboard}
                      >
                        {isCopied ? (
                          <i className="bi bi-clipboard-check-fill text-cesium-900"></i>
                        ) : (
                          <i className="bi bi-clipboard"></i>
                        )}
                      </button>
                    </div>
                  </div>

                  <Collapse className="w-72 rounded-xl border-gray-300 bg-white text-left shadow-sm lg:w-96">
                    <Collapse.Panel header="How does it work?" key="1">
                      <div className="text-justify">
                        The URL above allows you to{" "}
                        <a className="font-medium">subscribe</a> to your active{" "}
                        {isHome ? "events" : "schedule"} in Calendarium, using
                        your favorite calendar app.
                        <p />
                        This means that you will be able to see your{" "}
                        {isHome ? "events" : "schedule"} in your calendar app,
                        and add event notifications, change colors and make
                        other customizations.
                        <p />
                        Your {isHome ? "events" : "schedule"} will be
                        automatically synced with Calendarium.
                        <p />
                        <div className="rounded-lg bg-warning/20 p-3">
                          <i className="bi bi-exclamation-triangle-fill text-warning"></i>{" "}
                          If you make any changes to your{" "}
                          {isHome ? "events" : "schedule"} in Calendarium, you
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
                    className="w-72 rounded-xl border-gray-300 bg-white text-left shadow-sm lg:w-96"
                  >
                    <Collapse.Panel header="Google Calendar" key="1">
                      <div className="text-gray-900">
                        <text className="font-bold">1.</text> On your computer,
                        open{" "}
                        <a
                          href="https://calendar.google.com"
                          className="text-blue-500"
                        >
                          Google Calendar{" "}
                          <i className="bi bi-box-arrow-up-right"></i>
                        </a>
                        .
                        <p />
                        <text className="font-bold">2.</text> On the left, next
                        to {'"Other calendars"'}, click Add{" "}
                        <i className="bi bi-plus"></i>{" "}
                        <i className="bi bi-chevron-right"></i>{" "}
                        <text className="font-medium">From URL</text>.
                        <p />
                        <text className="font-bold">3.</text> Enter the above
                        calendar
                        {"'"}s address.
                        <p />
                        <text className="font-bold">4.</text> Click{" "}
                        <a className="font-medium">Add calendar</a>. The
                        calendar appears on the left, under{" "}
                        {'"Other calendars"'}.
                        <p />
                        <a
                          href="https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform=Desktop"
                          className="text-blue-500"
                        >
                          Know more <i className="bi bi-box-arrow-up-right"></i>
                        </a>
                      </div>
                    </Collapse.Panel>
                    <Collapse.Panel header="Apple Calendar" key="2">
                      <div className="text-gray-900">
                        <text className="font-bold">1.</text> On your iPhone,
                        open <a className="font-medium">Calendar</a>.
                        <p />
                        <text className="font-bold">2.</text> On the bottom,
                        click {'"Calendars"'}.
                        <p />
                        <text className="font-bold">3.</text> On the bottom
                        left, click {'"Add Calendar"'}{" "}
                        <i className="bi bi-chevron-right"></i>{" "}
                        <a className="font-medium">Add Subscription Calendar</a>
                        .
                        <p />
                        <text className="font-bold">3.</text> Enter the above
                        calendar
                        {"'"}s address.
                        <p />
                        <text className="font-bold">4.</text> Click{" "}
                        <a className="font-medium">Subscribe</a>. The calendar
                        appears under {'"Calendars"'}.
                        <p />
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
                      <div className="text-gray-900">
                        <text className="font-bold">1.</text> Sign in to{" "}
                        <a
                          href="https://go.microsoft.com/fwlink/p/?linkid=843379"
                          className="text-blue-500"
                        >
                          Outlook.com{" "}
                          <i className="bi bi-box-arrow-up-right"></i>
                        </a>
                        <p />
                        <text className="font-bold">2.</text> At the bottom of
                        the page, select the calendar icon.
                        <p />
                        <text className="font-bold">3.</text> In the navigation
                        pane, select <a className="font-medium">Add Calendar</a>
                        .
                        <p />
                        <text className="font-bold">4.</text> Select{" "}
                        <a className="font-medium">Subscribe from web</a>.
                        <p />
                        <text className="font-bold">5.</text> Enter the above
                        calendar{"'"}s address.
                        <p />
                        <text className="font-bold">6.</text> Select{" "}
                        <a className="font-medium">Import</a>.
                        <p />
                        <a
                          href="https://support.microsoft.com/en-gb/office/import-or-subscribe-to-a-calendar-in-outlook-com-cff1429c-5af6-41ec-a5b4-74f2c278e98c"
                          className="text-blue-500"
                        >
                          Know more <i className="bi bi-box-arrow-up-right"></i>
                        </a>
                      </div>
                    </Collapse.Panel>
                  </Collapse>

                  <div className="cursor-pointer select-none text-sm text-gray-500">
                    {isHome ? (
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

                  <div className="cursor-pointer select-none text-sm text-gray-500">
                    <i className="bi bi-lightbulb"></i> You can also{" "}
                    <a className="font-medium text-blue-400" href={URL}>
                      download as .ics file
                    </a>
                  </div>
                </div>
              </Typography>
            )}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default CalendarExportModal;
