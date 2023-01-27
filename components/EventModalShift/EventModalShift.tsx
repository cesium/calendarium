import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import { useState } from "react";

function EventModalShift({
  selectedShift: {
    id,
    title,
    theoretical,
    shift,
    building,
    room,
    day,
    start,
    end,
    filterId,
  },
  setInspectShift,
}) {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const start_hour = new Date(start).toLocaleTimeString("pt", {
    hour: "numeric",
    minute: "numeric",
  });

  const end_hour = new Date(end).toLocaleTimeString("pt", {
    hour: "numeric",
    minute: "numeric",
  });

  const handleModalClose = () => {
    setIsModalOpen(false);
    setInspectShift(false);
  };

  const substrings = title.split("-");

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

  const ano = String(filterId)[0];
  const semestre = String(filterId)[1];

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
              {substrings[0]}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {ano != "0" && ano != "6" ? (
                <p>
                  <i className="bi bi-mortarboard-fill"></i> {ano}º ano -{" "}
                  {semestre}º sem
                </p>
              ) : (
                ""
              )}
              <p>
                <i className="bi bi-clock-fill"></i> {start_hour} - {end_hour}
              </p>
              <p>
                <i className="bi bi-geo-alt-fill"></i>{" "}
                {building.includes("CP") ? "" : "Ed."} {building} - {room}
              </p>
              <i className="bi bi-briefcase-fill"></i> {shift}
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default EventModalShift;
