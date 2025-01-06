import { useState } from "react";
import ShareModal from "../ShareModal";
import { ISelectedFilterDTO } from "../../dtos";

type ShareButtonProps = {
  setChecked: (obj: number[] | ISelectedFilterDTO[]) => void;
};

const ShareButton = ({ setChecked }: ShareButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div>
      <button
        className="h-10 w-10 rounded-xl p-2 font-medium leading-3 text-neutral-300 shadow-md ring-1 ring-neutral-200/50 transition-all duration-300 hover:text-neutral-900 hover:shadow-lg dark:bg-neutral-800/70 dark:text-neutral-500 dark:ring-neutral-400/20 dark:hover:text-neutral-200"
        title="Share"
        onClick={() => setIsModalOpen(true)}
        data-umami-event="share-button"
        data-umami-event-type={info.isEvents ? "events" : "shifts"}
      >
        <i className="bi bi-share-fill"></i>
      </button>

      <ShareModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        setChecked={setChecked}
      />
    </div>
  );
};

export default ShareButton;
