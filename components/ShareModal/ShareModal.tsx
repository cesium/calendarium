import { Backdrop, Box, Fade, Modal } from "@mui/material";

import { useCallback, useEffect, useState } from "react";

import { IFilterDTO, ISelectedFilterDTO } from "../../dtos";

import { Collapse } from "antd";
import { useAppInfo } from "../../contexts/AppInfoProvider";

type ShareModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setChecked: (obj: ISelectedFilterDTO[]) => void;
};

const ShareModal = ({ isOpen, setIsOpen, setChecked }: ShareModalProps) => {
  const [code, setCode] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isImported, setIsImported] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const info = useAppInfo();
  const filters = info.filters as IFilterDTO[];

  /**
   * Check if the id corresponds to a filter
   * @param id - The id to be checked
   */
  function isValidId(id: number): boolean {
    return filters.some((f) => f.id === id);
  }

  /**
   * Get a filter by its id or name
   * @param idOrName - The id or name of the filter
   */
  function getFilterByIdOrName(idOrName: string) {
    return filters.find(
      (f) => f.name === idOrName || f.id.toString() === idOrName
    );
  }

  /**
   * Parses a shift string and returns the parsed shifts
   *
   * The shift string is in the format "id=shift1,shift2,shift3"
   * The reason for a list of shifts being returned is because the same id can have multiple shifts separated by a comma
   * @param shift - The shift string to be parsed
   */
  function parseShiftValid(shift: string): ISelectedFilterDTO[] | undefined {
    const [idOrName, shiftName] = shift.split("=");
    if (!idOrName || !shiftName) return undefined;

    const filter = getFilterByIdOrName(idOrName);
    if (!filter) return undefined;

    const shifts = shiftName.split(",").map((s) => s.toUpperCase());
    if (!shifts.every((s) => (filter as IFilterDTO).shifts.includes(s)))
      return undefined;

    return shifts.map((shift) => ({ id: (filter as IFilterDTO).id, shift }));
  }

  /**
   * Parses a shifts string separated by an ampersand using parseShiftValid
   *
   * If any shift is invalid, the function returns undefined
   * @param shiftsString
   */
  function parseShiftsValid(
    shiftsString: string
  ): ISelectedFilterDTO[] | undefined {
    const shifts = shiftsString.split("&").map(parseShiftValid);
    return shifts.every(Boolean) ? shifts.flat() : undefined;
  }

  /**
   * Parses an event string
   * If the there are no filters with the event string id or name, the function returns undefined
   *
   * @param eventString - The event string to be parsed
   */
  function parseEventValid(eventString: string): number | undefined {
    const event = getFilterByIdOrName(eventString) as IFilterDTO;
    return event ? event.id : undefined;
  }

  /**
   * Parses an events string separated by an ampersand using parseEventValid
   *
   * If any event is invalid, the function returns undefined
   * @param eventsString
   */
  function parseEvents(eventsString: string): ISelectedFilterDTO[] | undefined {
    const events = eventsString.split("&").map(parseEventValid);
    const formatedEvents = events.map((id) => ({ id }));
    return events.every(isValidId) ? formatedEvents : undefined;
  }

  const groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) =>
    list.reduce((previous, currentItem) => {
      const group = getKey(currentItem);
      if (!previous[group]) previous[group] = [];
      previous[group].push(currentItem);
      return previous;
    }, {} as Record<K, T[]>);

  const generateShareCodeHandle = useCallback((): string => {
    /**
     * Converts a list of shifts to a list of strings in the format "id=shift1,shift2,shift3"
     * Shifts with the same id are grouped together and will get separated by a comma
     *
     * Used to generate the share code
     *
     * @param shifts - The shift to be converted
     */
    function shiftsToStringArray(shifts: ISelectedFilterDTO[]): string[] {
      const groupedShifts = groupBy(shifts, ({ id }) => id);

      return Object.entries(groupedShifts).map(([id, shifts]) => {
        const identifier =
          filters.find((f) => f.id.toString() === id)?.name || id.toString();
        const shiftsString = shifts.map((shift) => shift.shift).join(",");
        return `${identifier}=${shiftsString}`;
      });
    }

    /**
     * Converts a list of events to a list of their names
     * Used to generate the share code
     *
     * @param eventIds - The event ids to be converted
     */
    function eventsToStringArray(eventIds: number[]): string[] {
      function eventToString(eventId: number): string {
        return (
          filters.find((f) => f.id === eventId)?.name || eventId.toString()
        );
      }

      return eventIds.map(eventToString);
    }

    const valuesRaw = localStorage.getItem(
      info.isEvents ? "checked" : "shifts"
    );
    if (!valuesRaw) return "";

    try {
      const values = JSON.parse(valuesRaw);
      const toStringArray = info.isEvents
        ? eventsToStringArray
        : shiftsToStringArray;

      return toStringArray(values)?.join("&") || "";
    } catch (error) {
      return "";
    }
  }, [info.isEvents, filters]);

  function copyToClipboardHandle() {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1000);
  }

  function importEventsHandle(e) {
    if (!e) return;

    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const rawCode = formData.get("code");
    if (typeof rawCode !== "string") return;

    const code = rawCode as string;

    const parsedData = info.isEvents
      ? parseEvents(code)
      : parseShiftsValid(code);
    if (!parsedData) {
      playErrorImportAnimation();
      return;
    }

    info.handleFilters(parsedData);
    setChecked(parsedData);
    localStorage.setItem(
      info.isEvents ? "checked" : "shifts",
      JSON.stringify(
        info.isEvents ? parsedData.map(({ id }) => id) : parsedData
      )
    );
    playValidImportAnimation();
  }

  function playErrorImportAnimation() {
    setIsError(true);
    setTimeout(() => setIsError(false), 2000);
  }

  function playValidImportAnimation() {
    setIsImported(true);
    setTimeout(() => setIsImported(false), 2000);
  }

  useEffect(() => {
    setCode(generateShareCodeHandle());
  }, [generateShareCodeHandle, isOpen]);

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
            className="absolute left-1/2 top-1/2 h-fit w-80 -translate-x-1/2 -translate-y-1/2 transform overflow-y-auto rounded-2xl border bg-white p-6 text-center shadow-xl dark:border-neutral-400/20 dark:bg-neutral-800"
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
                Share Your {info.isEvents ? "Events" : "Schedule"}{" "}
                <i className="bi bi-link-45deg"></i>
              </span>
              <div id="modal-modal-description">
                <div>
                  <div className="flex">
                    <form
                      className="flex rounded-lg shadow-sm"
                      onSubmit={importEventsHandle}
                    >
                      <div className="relative flex flex-grow items-stretch focus-within:z-10">
                        <input
                          name="code"
                          className="block w-full rounded-none rounded-l-lg border-0 py-1.5 ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-cesium-900 dark:bg-neutral-800 dark:ring-neutral-400/30 sm:text-sm sm:leading-6"
                          placeholder="Insert a share code here"
                        />
                      </div>
                      <button
                        type="submit"
                        className="relative -ml-px inline-flex w-[38px] place-content-center items-center gap-x-1.5 rounded-r-lg px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 dark:ring-neutral-400/30 dark:hover:bg-neutral-400/10"
                        title="Import"
                        data-umami-event="share-import-button"
                        data-umami-event-type={
                          info.isEvents ? "events" : "shifts"
                        }
                      >
                        {isImported ? (
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
                      className="relative ml-2 inline-flex items-center rounded-lg px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 dark:ring-neutral-400/30 dark:hover:bg-neutral-400/10"
                      title="Copy your share code"
                      onClick={copyToClipboardHandle}
                      data-umami-event="share-copy-button"
                      data-umami-event-type={
                        info.isEvents ? "events" : "shifts"
                      }
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
              <Collapse className="w-full rounded-lg border-neutral-300 bg-white text-left font-display shadow-sm">
                <Collapse.Panel header="How does it work?" key="1">
                  <div className="text-justify">
                    <span className="font-medium">
                      Copy your share code with <i className="bi bi-copy" />
                    </span>{" "}
                    to share your {info.isEvents ? "events" : "schedule"} with
                    your friends or with another device.
                    <p></p>
                    <span className="font-medium">
                      Paste a share code and click{" "}
                      <i className="bi bi-download" />
                    </span>{" "}
                    to import your friend{"'"}s{" "}
                    {info.isEvents ? "events" : "schedule"} or the{" "}
                    {info.isEvents ? "events" : "schedule"} you set up on
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
