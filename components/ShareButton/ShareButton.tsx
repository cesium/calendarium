import { useState } from "react";

import ShareModal from "../ShareModal";

import { IFilterDTO } from "../../dtos";

import { SelectedShift } from "../../types";

type ShareButtonProps = {
  isHome: boolean;
  filters: IFilterDTO[];
  handleFilters: any;
  setChecked: (obj: number[] | SelectedShift[]) => void;
};

const shareButton = ({
  isHome,
  filters,
  handleFilters,
  setChecked,
}: ShareButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div>
      <button
        className="h-10 w-10 rounded-2xl p-2 font-medium text-gray-300 shadow-md ring-1 ring-zinc-200/50 transition-all duration-300 hover:text-gray-900 hover:shadow-lg"
        title="Share"
        onClick={() => setIsModalOpen(true)}
      >
        <i className="bi bi-share-fill"></i>
      </button>

      <ShareModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        isHome={isHome}
        filters={filters}
        handleFilters={handleFilters}
        setChecked={setChecked}
      />
    </div>
  );
};

export default shareButton;
