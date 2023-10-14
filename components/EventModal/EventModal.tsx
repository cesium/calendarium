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

  return (
    <div>
      <Modal
        open={inspectEvent}
        onClose={handleModalClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 300 } }}
      >
        <Fade in={inspectEvent}>
          <Box className="absolute left-1/2 top-1/2 h-fit w-fit min-w-[18rem] -translate-x-1/2 -translate-y-1/2 transform rounded-3xl border bg-white p-6 text-center shadow-xl">
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
                <i className="bi bi-calendar-fill"></i>{" "}
                {start_date.localeCompare(end_date)
                  ? `${start_date} - ${end_date}`
                  : `${start_date}`}
                {start_hour.localeCompare("00:00") &&
                !start_date.localeCompare(end_date) ? (
                  <div>
                    <p></p>
                    <i className="bi bi-clock-fill"></i> {start_hour} -{" "}
                    {end_hour}
                  </div>
                ) : (
                  ""
                )}
              </div>
              {/* PLACE */}
              {selectedEvent.place ? (
                <div>
                  <p></p>
                  <i className="bi bi-geo-alt-fill"></i> {selectedEvent.place}
                </div>
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
                    style={{ color: "rgb(24, 144, 255, 1)" }}
                  >
                    {selectedEvent.link.replace("https://", "")}
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
