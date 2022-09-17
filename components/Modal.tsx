import { Modal } from "antd";
import { useState } from "react";

function EventModal({
  selectedEvent: { title, start, end, groupId },
  setInspectEvent,
}) {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const start_date = new Date(start).toLocaleDateString("pt", {
    hour: "numeric",
    minute: "numeric",
  });

  const end_date = new Date(end).toLocaleDateString("pt", {
    hour: "numeric",
    minute: "numeric"
  });

  const handleModalClose = () => {
    setIsModalOpen(false);
    setInspectEvent(false);
  };

  return (
    <>
      <Modal
        title={title}
        open={isModalOpen}
        footer={null}
        centered={true}
        width={500}
        onCancel={(_) => handleModalClose()}
      >
        <p>Descrição: {title}</p>
        <p>
          Data:{" "}
          {`${start_date} - ${end_date}`}
        </p>
        <p>{groupId != 0 ? `Ano: ${groupId}º` : ""}</p>
      </Modal>
    </>
  );
}

export default EventModal;
