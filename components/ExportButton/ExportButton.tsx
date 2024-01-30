import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";

import CalendarExportModal from "../CalendarExportModal";

import { IFilterDTO } from "../../dtos";

type ExportButtonProps = {
  exportPDF: () => void;
  isHome: boolean;
  filters: IFilterDTO[];
};

const ExportButton = ({ exportPDF, isHome, filters }: ExportButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full leading-3">
      <Menu as="div" className="relative inline-block w-full text-left">
        <div>
          <Menu.Button className="inline-flex h-10 w-full place-content-center items-center rounded-xl bg-cesium-900 p-2 font-medium text-white shadow-md transition-shadow duration-300 hover:shadow-lg hover:shadow-cesium-900/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cesium-500">
            Export <i className="bi bi-chevron-down ml-1"></i>
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-fit origin-top-right overflow-hidden rounded-xl bg-white dark:bg-neutral-800 font-medium text-cesium-900 dark:text-cesium-600 shadow-lg ring-1 ring-black  dark:ring-white/20 ring-opacity-5 focus:outline-none">
            <div className="grid grid-cols-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active && "bg-cesium-100 dark:bg-neutral-100/10"
                    } 'block text-sm' px-4 py-2`}
                    title="Add your events to your favorite calendar app."
                    onClick={() => setIsModalOpen(true)}
                  >
                    <div className="flex place-content-between items-center space-x-6">
                      <div>Calendar</div>
                      <i className="bi bi-chevron-right"></i>
                    </div>
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active && "bg-cesium-100 dark:bg-neutral-100/10"
                    } 'block text-sm' px-4 py-2`}
                    onClick={() => exportPDF()}
                  >
                    <div className="flex place-content-between items-center space-x-6">
                      <div>PDF</div>
                      <i className="bi bi-file-earmark-pdf"></i>
                    </div>
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

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
