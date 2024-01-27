import { IFilterDTO } from "../../dtos";

import Themes from "../Themes";
import Install from "../Install";
import DarkModeToggler from "../DarkModeToggler";

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
    <div className="h-full w-full select-none space-y-4 overflow-hidden rounded-xl p-4 shadow-default ring-1 ring-neutral-200/30 dark:ring-neutral-400/20 dark:bg-neutral-800/70">
      {/* Title */}
      <div className="text-center text-lg font-medium">Settings</div>
      <div className="border-b border-neutral-200/80 dark:border-neutral-400/30" />
      {/* Configs */}
      <Themes
        saveTheme={saveTheme}
        filters={filters}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isHome={isHome}
      />
      <DarkModeToggler />
      <Install />
    </div>
  );
};

export default Settings;
