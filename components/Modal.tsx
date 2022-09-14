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
  let title = info.content.title;
  let start = JSON.stringify(info.content.start);
  let end = JSON.stringify(info.content.end);
  start = start.substring(1, 11) + " " + start.substring(12, 20);
  end = end.substring(1, 11) + " " + end.substring(12, 20);

  let groupId = info.content.groupId;

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
