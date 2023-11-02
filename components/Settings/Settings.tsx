import { IFilterDTO } from "../../dtos";

import Themes from "../Themes";

type SettingsProps = {
  saveTheme: () => void;
  filters: IFilterDTO[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isHome: boolean;
};

const Settings = ({
  saveTheme,
  filters,
  isOpen,
  setIsOpen,
  isHome,
}: SettingsProps) => {
  return (
    <div className="h-full w-full select-none space-y-4 overflow-hidden rounded-2xl p-4 shadow-default ring-1 ring-zinc-200/30">
      {/* Title */}
      <div className="text-center text-lg font-medium text-gray-900">
        Settings
      </div>
      <div className="border-b border-zinc-200/80" />
      {/* Configs */}
      <Themes
        saveTheme={saveTheme}
        filters={filters}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isHome={isHome}
      />
    </div>
  );
};

export default Settings;
