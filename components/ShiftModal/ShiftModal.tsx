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

  const end_hour = () => {
    const eh = new Date(selectedShift.end);
    eh.setMinutes(eh.getMinutes() + 1); // add 1 minute to compensate, refer to the comment on schedule.tsx
    return eh.toLocaleTimeString("pt", {
      hour: "numeric",
      minute: "numeric",
    });
  };

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
        slotProps={{ backdrop: { timeout: 400 } }}
      >
        <Fade in={inspectShift} timeout={400}>
          <Box
            className="absolute left-1/2 top-1/2 h-fit w-fit min-w-[18rem] -translate-x-1/2 -translate-y-1/2 transform rounded-2xl border border-neutral-200 bg-white dark:bg-neutral-800 dark:border-neutral-400/20 p-6 text-center shadow-xl"
            style={{ maxWidth: "calc(100% - 4rem)" }}
          >
            <div className="space-y-4 font-display">
              <div className="m-auto w-fit border-b dark:border-neutral-400/30 pb-4">
                <span id="modal-modal-title" className="text-xl font-medium">
                  {name}
                </span>
              </div>
              <div id="modal-modal-description">
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
                  <i className="bi bi-clock-fill"></i> {start_hour} -{" "}
                  {end_hour()}
                </p>
                {/* PLACE */}
                <p>
                  <i className="bi bi-geo-alt-fill"></i>{" "}
                  {selectedShift.building.includes("CP") ? "" : "Ed."}{" "}
                  {selectedShift.building} - {selectedShift.room}
                </p>
                <i className="bi bi-briefcase-fill"></i> {selectedShift.shift}
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default ShiftModal;
