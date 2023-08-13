import { Modal, Box, Typography, Grow } from "@mui/material";

function ShiftModal({
  selectedShift: { id, shift, building, room, start, end, filterId },
  setInspectShift,
  inspectShift,
  shifts,
}) {
  const start_hour = new Date(start).toLocaleTimeString("pt", {
    hour: "numeric",
    minute: "numeric",
  });

  const end_hour = new Date(end).toLocaleTimeString("pt", {
    hour: "numeric",
    minute: "numeric",
  });

  const handleModalClose = () => {
    setInspectShift(false);
  };

  const style = {
    position: "absolute",
    borderRadius: "24px",
    top: "50%",
    left: "50%",
    width: 260,
    bgcolor: "white",
    boxShadow: 24,
    p: 4,
    textAlign: "center",
  };

  const ano = String(filterId)[0];
  const semestre = String(filterId)[1];

  const name = shifts.find((shift) => shift.id === id).title;

  return (
    <div>
      <Modal open={inspectShift} onClose={handleModalClose}>
        <Grow in={inspectShift}>
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
              {name}
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
        </Grow>
      </Modal>
    </div>
  );
}

export default ShiftModal;
