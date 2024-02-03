import { Modal, Box, Typography, Fade, Backdrop } from "@mui/material";

import { IEventDTO } from "../../dtos";

type EventModalProps = {
  selectedEvent: IEventDTO;
  setInspectEvent: (boolean) => void;
  inspectEvent: boolean;
};

function EventModal({
  selectedEvent,
  setInspectEvent,
  inspectEvent,
}: EventModalProps) {
  const start_date = new Date(selectedEvent.start).toLocaleDateString("pt", {});

  const start_hour = new Date(selectedEvent.start).toLocaleTimeString("pt", {
    hour: "numeric",
    minute: "numeric",
  });

  const end_date = new Date(selectedEvent.end).toLocaleDateString("pt", {});

  const end_hour = new Date(selectedEvent.end).toLocaleTimeString("pt", {
    hour: "numeric",
    minute: "numeric",
  });

  const handleModalClose = () => {
    setInspectEvent(false);
  };

  const dateInfo = (
    <>
      <i className="bi bi-calendar-fill"></i>{" "}
      {start_date.localeCompare(end_date)
        ? `${start_date.slice(0, 5)} - ${end_date.slice(0, 5)}`
        : `${start_date.slice(0, 5)}`}
    </>
  );

  const formattedLink = (link: string) => (
    <>
      {selectedEvent.link.replace("https://", "").length > 30
        ? selectedEvent.link.replace("https://", "").split("/")[0] + "/..."
        : selectedEvent.link.replace("https://", "")}
    </>
  );

  return (
    <div>
      <Modal
        open={inspectEvent}
        onClose={handleModalClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 400 } }}
      >
        <Fade in={inspectEvent} timeout={400}>
          <Box
            className="absolute left-1/2 top-1/2 h-fit w-fit min-w-[18rem] max-w-full -translate-x-1/2 -translate-y-1/2 transform rounded-2xl border border-neutral-200 bg-white dark:bg-neutral-800 dark:border-neutral-400/20 p-6 text-center shadow-xl"
            style={{ maxWidth: "calc(100% - 4rem)" }}
          >
            <div className="space-y-4 font-display">
              <div className="m-auto w-fit border-b dark:border-neutral-400/30 pb-4">
                <span id="modal-modal-title" className="text-xl font-medium">
                  {selectedEvent.title}
                </span>
              </div>
              <div id="modal-modal-description">
                {/* DATE & TIME */}
                <div>
                  {start_hour.localeCompare("00:00") ? (
                    start_date.localeCompare(end_date) ? (
                      <div>
                        <p></p>
                        <i className="bi bi-clock-fill"></i>{" "}
                        <span className="font-medium">
                          {start_date.slice(0, 5)}
                        </span>
                        , {start_hour} -{" "}
                        <span className="font-medium">
                          {end_date.slice(0, 5)}
                        </span>
                        , {end_hour}
                      </div>
                    ) : (
                      <div>
                        {dateInfo}
                        <p></p>
                        <i className="bi bi-clock-fill"></i> {start_hour} -{" "}
                        {end_hour}
                      </div>
                    )
                  ) : (
                    <>{dateInfo}</>
                  )}
                </div>
                {/* PLACE */}
                {selectedEvent.place ? (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${selectedEvent.place.replace(
                      " ",
                      "+"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <p></p>
                    <i className="bi bi-geo-alt-fill"></i> {selectedEvent.place}
                  </a>
                ) : (
                  ""
                )}
                {/* YEAR */}
                {selectedEvent.groupId > 0 && selectedEvent.groupId < 6 ? (
                  <div>
                    <p></p>
                    <i className="bi bi-mortarboard-fill"></i>{" "}
                    {selectedEvent.groupId}º ano
                  </div>
                ) : (
                  ""
                )}
                {/* LINK */}
                {selectedEvent.link && (
                  <div>
                    <p></p>
                    <i className="bi bi-link-45deg"></i>
                    <a
                      href={selectedEvent.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {formattedLink(selectedEvent.link)}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default EventModal;
