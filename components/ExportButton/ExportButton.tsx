import { useState } from "react";
import CalendarExportModal from "../CalendarExportModal";
import { useAppInfo } from "../../contexts/AppInfoProvider";

const ExportButton = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const info = useAppInfo();

  return (
    <div className="w-full">
      <button
        onClick={() => setIsModalOpen(true)}
        title="Export"
        className="h-10 w-full rounded-xl p-2 font-medium leading-3 text-neutral-300 shadow-md ring-1 ring-neutral-200/50 transition-all duration-300 hover:text-neutral-900 hover:shadow-lg dark:bg-neutral-800/70 dark:text-neutral-500 dark:ring-neutral-400/20 dark:hover:text-neutral-200"
        data-umami-event="export-button"
        data-umami-event-type={info.isEvents ? "events" : "shifts"}
      >
        Export <i className="bi bi-box-arrow-up"></i>
      </button>

      <CalendarExportModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </div>
  );
};

export default ExportButton;
