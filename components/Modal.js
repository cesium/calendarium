import { Button, Modal } from "antd";
import { useState } from "react";

const style = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
};

function BasicModal(info) {
  const [isModalOpen, setIsModalOpen] = useState(true);
  console.log(info);
  let title = info.content.title;
  let start = JSON.stringify(info.content.start);
  let end = JSON.stringify(info.content.end);
  // transform start and end into a more readable format
  start = start.substring(1, 11);
  end = end.substring(1, 11);

  let groupId = info.content.groupId;

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        title={title}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={500}
        centered={true}
        visible={isModalOpen}
      >
        <p>
          Data: {start} - {end}
        </p>
        <p>Ano: {groupId}</p>
        <p>Descrição</p>
      </Modal>
    </>
  );
}

export default BasicModal;
