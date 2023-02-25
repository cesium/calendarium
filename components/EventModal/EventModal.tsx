import { Modal, Box, Typography, Grow } from "@mui/material";
import { useState } from "react";

function EventModal({
  selectedEvent: { title, place, start, end, groupId },
  setInspectEvent,
  inspectEvent,
}) {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const start_date = new Date(start).toLocaleDateString("pt", {});

  const start_hour = new Date(start).toLocaleTimeString("pt", {
    hour: "numeric",
    minute: "numeric",
  });

  const end_date = new Date(end).toLocaleDateString("pt", {});

  const end_hour = new Date(end).toLocaleTimeString("pt", {
    hour: "numeric",
    minute: "numeric",
  });

  const handleModalClose = () => {
    setInspectEvent(false);
  };

  const style = {
    position: "absolute" as "absolute",
    borderRadius: "30px",
    top: "50%",
    left: "50%",
    width: 300,
    bgcolor: "white",
    boxShadow: 24,
    p: 4,
    textAlign: "center",
  };

  return (
    <div>
      <Modal open={inspectEvent} onClose={handleModalClose}>
        <Grow in={inspectEvent}>
          <Box sx={style} style={{ transform: "translate(-50%, -50%)" }}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              style={{
                padding: "0 0 0.75rem 0",
                borderBottom: "solid rgba(200,200,200,.5) 1px",
              }}
            >
              {title}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <i className="bi bi-calendar-fill"></i>{" "}
              {start_date.localeCompare(end_date)
                ? `${start_date} - ${end_date}`
                : `${start_date}`}
              {start_hour.localeCompare("00:00") &&
              !start_date.localeCompare(end_date) ? (
                <div>
                  <p></p>
                  <i className="bi bi-clock-fill"></i> {start_hour} - {end_hour}
                </div>
              ) : (
                ""
              )}
              {place ? (
                <div>
                  <p></p>
                  <i className="bi bi-geo-alt-fill"></i> {place}
                </div>
              ) : (
                ""
              )}
              {groupId != 0 && groupId < 6 ? (
                <div>
                  <p></p>
                  <i className="bi bi-mortarboard-fill"></i> {groupId}º ano
                </div>
              ) : (
                ""
              )}
              {groupId == 7 ? (
                <div>
                  <p></p>
                  <i className="bi bi-link-45deg"></i>
                  <a
                    href="https://seium.org"
                    style={{ color: "rgb(24, 144, 255, 1)" }}
                  >
                    seium.org
                  </a>
                </div>
              ) : (
                ""
              )}
              {groupId == 8 ? (
                <div>
                  <p></p>
                  <i className="bi bi-link-45deg"></i>
                  <a
                    href="https://coderdojobraga.org"
                    style={{ color: "rgb(24, 144, 255, 1)" }}
                  >
                    coderdojobraga.org
                  </a>
                </div>
              ) : (
                ""
              )}
              {groupId == 9 ? (
                <div>
                  <p></p>
                  <i className="bi bi-link-45deg"></i>
                  <a
                    href="https://join.di.uminho.pt/"
                    style={{ color: "rgb(24, 144, 255, 1)" }}
                  >
                    join.di.uminho.pt/
                  </a>
                </div>
              ) : (
                ""
              )}
            </Typography>
          </Box>
        </Grow>
      </Modal>
    </div>
  );
}

export default EventModal;
