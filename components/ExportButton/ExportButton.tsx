import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";

import CalendarExportModal from "../CalendarExportModal";

import { IFilterDTO } from "../../dtos";

type ExportButtonProps = {
  isHome: boolean;
  filters: IFilterDTO[];
};

const ExportButton = ({ isHome, filters }: ExportButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full">
      <button
        onClick={() => setIsModalOpen(true)}
        title="Export"
        className="h-10 w-full rounded-xl p-2 font-medium leading-3 text-neutral-300 shadow-md ring-1 ring-neutral-200/50 transition-all duration-300 hover:text-neutral-900 hover:shadow-lg dark:bg-neutral-800/70 dark:text-neutral-500 dark:ring-neutral-400/20 dark:hover:text-neutral-200"
        data-umami-event="export-button"
        data-umami-event-type={isHome ? "events" : "shifts"}
      >
        Export <i className="bi bi-box-arrow-up"></i>
      </button>

      <CalendarExportModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        isHome={isHome}
        filters={filters}
      />
    </div>
  );
};

export default ExportButton;
