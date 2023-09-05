import { Modal, Box, Typography, Fade, Backdrop } from "@mui/material";

import { useState } from "react";

import { Collapse } from "antd";

type CalendarExportModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isHome: boolean;
};

const CalendarExportModal = ({
  isOpen,
  setIsOpen,
  isHome,
}: CalendarExportModalProps) => {
  const [isCopied, setIsCopied] = useState(false);

  function copyToClipboard() {
    navigator.clipboard.writeText(
      "https://calendarium.cesium.di.uminho.pt/api/export?subjects=221,222" // TODO: function that generates actual URL
    );
    setIsCopied(true);
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
          <Box className="absolute left-1/2 top-1/2 h-fit w-fit -translate-x-1/2 -translate-y-1/2 transform rounded-3xl border bg-white p-6 text-center shadow-xl">
            <Typography
              id="modal-modal-title"
              className="select-none place-content-center items-center text-gray-900"
              variant="h6"
              component="h2"
            >
              Export by URL <i className="bi bi-link-45deg"></i>
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <div className="space-y-4">
                <div>
                  <div className="w- mt-2 flex rounded-xl shadow-sm">
                    <div className="relative flex flex-grow focus-within:z-10">
                      <div className="whitespace-nowrap rounded-none rounded-l-xl border-0 px-3 py-1.5 text-left text-gray-900 ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6">
                        <div className="w-56 overflow-y-hidden overflow-x-scroll pb-2 lg:w-80">
                          {/* TODO: function that generates actual URL */}
                          https://calendarium.cesium.di.uminho.pt/api/export?subjects=221,222
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

                <Collapse
                  accordion
                  className="w-72 rounded-xl border-gray-300 bg-white text-left shadow-sm lg:w-96"
                >
                  <Collapse.Panel header="Google Calendar" key="1">
                    <div className="text-gray-900">
                      <a className="font-bold">1.</a> On your computer, open{" "}
                      <a
                        href="https://calendar.google.com"
                        className="text-blue-500"
                      >
                        Google Calendar{" "}
                        <i className="bi bi-box-arrow-up-right"></i>
                      </a>
                      .
                      <p />
                      <a className="font-bold">2.</a> On the left, next to{" "}
                      {'"Other calendars"'}, click Add{" "}
                      <i className="bi bi-plus"></i>{" "}
                      <i className="bi bi-chevron-right"></i>{" "}
                      <text className="font-medium">From URL</text>.
                      <p />
                      <a className="font-bold">3.</a> Enter the above calendar{"\'"}s
                      address.
                      <p />
                      <a className="font-bold">4.</a> Click{" "}
                      <a className="font-medium">Add calendar</a>. The calendar
                      appears on the left, under {'"Other calendars"'}.
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
                      <a className="font-bold">1.</a> On your iPhone, open{" "}
                      <a className="font-medium">Calendar</a>.
                      <p />
                      <a className="font-bold">2.</a> On the bottom, click{" "}
                      {'"Calendars"'}.
                      <p />
                      <a className="font-bold">3.</a> On the bottom left, click{" "}
                      {'"Add Calendar"'} <i className="bi bi-chevron-right"></i>{" "}
                      <a className="font-medium">Add Subscription Calendar</a>.
                      <p />
                      <a className="font-bold">3.</a> Enter the above calendar{"\'"}s
                      address.
                      <p />
                      <a className="font-bold">4.</a> Click{" "}
                      <a className="font-medium">Subscribe</a>. The calendar
                      appears under {'"Calendars"'}.
                      <p />
                      <i className="bi bi-lightbulb"></i> You can also{" "}
                      <a
                        href="https://support.google.com/calendar/answer/99358?hl=en&co=GENIE.Platform%3DiOS&oco=0"
                        className="text-blue-500"
                      >
                        add your Google Calendar events to Apple Calendar{" "}
                        <i className="bi bi-box-arrow-up-right"></i>
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
              </div>
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default CalendarExportModal;
