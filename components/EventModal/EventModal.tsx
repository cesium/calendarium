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
            className="absolute left-1/2 top-1/2 h-fit w-fit min-w-[18rem] max-w-full -translate-x-1/2 -translate-y-1/2 transform rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-xl"
            style={{ maxWidth: "calc(100% - 4rem)" }}
          >
            <Typography
              id="modal-modal-title"
              className="border-b pb-3"
              variant="h6"
              component="h2"
            >
              {selectedEvent.title}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {/* DATE & TIME */}
              <div>
                {start_hour.localeCompare("00:00") ? (
                  start_date.localeCompare(end_date) ? (
                    <div>
                      <p></p>
                      <i className="bi bi-clock-fill"></i>{" "}
                      <text className="font-medium">
                        {start_date.slice(0, 5)}
                      </text>
                      , {start_hour} -{" "}
                      <text className="font-medium">
                        {end_date.slice(0, 5)}
                      </text>
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
                    {selectedEvent.link.replace("https://", "").length > 30
                      ? selectedEvent.link
                          .replace("https://", "")
                          .split("/")[0] + "/..."
                      : selectedEvent.link.replace("https://", "")}
                  </a>
                </div>
              )}
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default EventModal;
