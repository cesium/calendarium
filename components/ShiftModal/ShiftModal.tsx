import { Modal, Box, Typography, Fade, Backdrop } from "@mui/material";

import { IShiftDTO } from "../../dtos";

type ShiftModalProps = {
  selectedShift: IShiftDTO;
  setInspectShift: (boolean) => void;
  inspectShift: boolean;
  shifts: IShiftDTO[];
};

function ShiftModal({
  selectedShift,
  setInspectShift,
  inspectShift,
  shifts,
}: ShiftModalProps) {
  const start_hour = new Date(selectedShift.start).toLocaleTimeString("pt", {
    hour: "numeric",
    minute: "numeric",
  });

  const end_hour = new Date(selectedShift.end).toLocaleTimeString("pt", {
    hour: "numeric",
    minute: "numeric",
  });

  const handleModalClose = () => {
    setInspectShift(false);
  };

  const ano = String(selectedShift.filterId)[0];
  const semestre = String(selectedShift.filterId)[1];

  const name = shifts.find((shift) => shift.id === selectedShift.id).title;

  return (
    <div>
      <Modal
        open={inspectShift}
        onClose={handleModalClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 300 } }}
      >
        <Fade in={inspectShift}>
          <Box className="absolute left-1/2 top-1/2 h-fit w-72 -translate-x-1/2 -translate-y-1/2 transform rounded-3xl border bg-white p-6 text-center shadow-xl">
            <Typography
              id="modal-modal-title"
              className="border-b pb-3"
              variant="h6"
              component="h2"
            >
              {name}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {/* YEAR */}
              {ano != "0" && ano != "6" ? (
                <p>
                  <i className="bi bi-mortarboard-fill"></i> {ano}º ano -{" "}
                  {semestre}º sem
                </p>
              ) : (
                ""
              )}
              {/* TIME */}
              <p>
                <i className="bi bi-clock-fill"></i> {start_hour} - {end_hour}
              </p>
              {/* PLACE */}
              <p>
                <i className="bi bi-geo-alt-fill"></i>{" "}
                {selectedShift.building.includes("CP") ? "" : "Ed."}{" "}
                {selectedShift.building} - {selectedShift.room}
              </p>
              <i className="bi bi-briefcase-fill"></i> {selectedShift.shift}
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default ShiftModal;