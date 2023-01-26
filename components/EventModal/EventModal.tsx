import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import { useState } from "react";

function EventModal({
  selectedEvent: { title, place, start, end, groupId },
  setInspectEvent,
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
    setIsModalOpen(false);
    setInspectEvent(false);
  };

  const style = {
    position: "absolute",
    borderRadius: "30px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 260,
    bgcolor: "white",
    boxShadow: 24,
    p: 4,
    textAlign: "center",
  };

  return (
    <div>
      <Modal open={isModalOpen} onClose={handleModalClose}>
        <Fade in={isModalOpen}>
          <Box sx={style}>
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
              {start_hour.localeCompare("00:00") ? (
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
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default EventModal;
