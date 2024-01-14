import { Modal, Box, Typography, Fade, Backdrop } from "@mui/material";

import { useState, useEffect } from "react";

import { IFilterDTO } from "../../dtos";

import { SelectedShift } from "../../types";

import { Collapse } from "antd";

type ShareModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isHome: boolean;
  filters: IFilterDTO[];
  handleFilters: any;
  setChecked: (obj: number[] | SelectedShift[]) => void;
};

const ShareModal = ({
  isOpen,
  setIsOpen,
  isHome,
  filters,
  handleFilters,
  setChecked,
}: ShareModalProps) => {
  const [link, setLink] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [isImported, setIsImported] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

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

  function generateShareLink(): string {
    var link: string = "";
    if (isHome) {
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

      // build link string
      link = validCheckedEvents.join("&");
    } else {
      // helps format each shift parameter
      const toString = (shift: { id: number; shift: string }) => {
        return `${shift.id}=${shift.shift}`;
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

      // build link string
      link = `${validCheckedShifts.map((shift) => toString(shift)).join("&")}`;
    }
    return link;
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1000);
  }

  function importEvents(e) {
    // prevent the browser from reloading the page
    e.preventDefault();

    // read the form data
    const form = e.target;
    const formData = new FormData(form);

    // get the link from the form data
    const link: string | File = formData.get("link");

    if (link instanceof File) return false;

    // for events
    if (isHome) {
      // get subject ids
      const subjectIds: string[] = (link as string).split("&");

      // validate subject ids
      const filterIds = filters.map((f) => f.id);
      const valid =
        subjectIds.length > 0 &&
        subjectIds.every((id) => filterIds.includes(parseInt(id)));

      if (valid) {
        importAnimation(false);

        const checkedEvents: number[] = subjectIds.map((id) => parseInt(id));

        handleFilters(checkedEvents);
        setChecked(checkedEvents);
        localStorage.setItem("checked", JSON.stringify(checkedEvents));
      } else importAnimation(true);
    }
    // for schedules
    else {
      // get entries
      const entries: [string, string[]][] = link
        .split("&")
        .map((e) => [
          e.split("=")[0] ?? "",
          (e.split("=")[1] ?? "").split(","),
        ]);

      // validate entries
      const valid: boolean =
        entries.length > 0 &&
        entries.every((entry) => {
          const [key, value] = entry;

          const filter = filters.find((f) => f.id === parseInt(key));

          return filter && value.every((v) => filter.shifts.includes(v));
        });

      if (valid) {
        importAnimation(false);

        // get checked shifts
        const checkedShifts: SelectedShift[] = entries
          .map((entry) => {
            const [key, value] = entry;
            const filter = filters.find((f) => f.id === parseInt(key));

            return value.map((v) => ({ id: filter.id, shift: v }));
          })
          .flat();

        handleFilters(checkedShifts);
        setChecked(checkedShifts);
        localStorage.setItem("shifts", JSON.stringify(checkedShifts));
      } else importAnimation(true);
    }
  }

  function importAnimation(err: boolean = false) {
    setIsImporting(true);
    setTimeout(() => setIsImporting(false), 1000);
    if (!err) {
      setIsImported(true);
      setTimeout(() => setIsImported(false), 2000);
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 2000);
    }
  }

  useEffect(() => {
    setLink(generateShareLink());
  });

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
            className="absolute left-1/2 top-1/2 h-fit w-80 -translate-x-1/2 -translate-y-1/2 transform overflow-y-auto rounded-2xl border bg-white p-6 text-center shadow-xl"
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
                Share Your {isHome ? "Events" : "Schedule"}{" "}
                <i className="bi bi-link-45deg"></i>
              </span>
              <div id="modal-modal-description">
                <div>
                  <div className="flex">
                    <form
                      className="flex rounded-lg shadow-sm"
                      onSubmit={importEvents}
                    >
                      <div className="relative flex flex-grow items-stretch focus-within:z-10">
                        <input
                          name="link"
                          className="block w-full rounded-none rounded-l-lg border-0 py-1.5 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cesium-900 sm:text-sm sm:leading-6"
                          placeholder="Insert a share link here..."
                        />
                      </div>
                      <button
                        type="submit"
                        className="relative -ml-px inline-flex w-[38px] place-content-center items-center gap-x-1.5 rounded-r-lg px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        title="Import"
                      >
                        {isImporting ? (
                          // Spinner SVG
                          <svg
                            className="h-4 w-4 animate-spin text-cesium-900"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : isImported ? (
                          <i className="bi bi-check-circle-fill text-cesium-900" />
                        ) : isError ? (
                          <i className="bi bi-exclamation-triangle-fill text-red-600" />
                        ) : (
                          <i className="bi bi-download" />
                        )}
                      </button>
                    </form>
                    <button
                      type="button"
                      className="relative ml-2 inline-flex items-center rounded-lg px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      title="Copy your share link"
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
              </div>
              <Collapse className="w-full rounded-lg border-gray-300 bg-white text-left font-display shadow-sm">
                <Collapse.Panel header="How does it work?" key="1">
                  <div className="text-justify">
                    <a className="font-medium">
                      Copy your share code with <i className="bi bi-copy" />
                    </a>{" "}
                    to share your {isHome ? "events" : "schedule"} with your
                    friends or with another device.
                    <p></p>
                    <a className="font-medium">
                      Paste a share code and click{" "}
                      <i className="bi bi-download" />
                    </a>{" "}
                    to import your friend{"'"}s {isHome ? "events" : "schedule"}{" "}
                    or the {isHome ? "events" : "schedule"} you set up on
                    another device.
                  </div>
                </Collapse.Panel>
              </Collapse>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default ShareModal;
