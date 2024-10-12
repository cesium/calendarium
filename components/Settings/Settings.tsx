import { IFilterDTO } from "../../dtos";

import Themes from "../Themes";
import Install from "../Install";
import DarkModeToggler from "../DarkModeToggler";
import { BeforeInstallPromptEvent } from "../../types";

type SettingsProps = {
  fetchTheme: () => void;
  filters: IFilterDTO[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isHome: boolean;
  installPwaPrompt: BeforeInstallPromptEvent;
};

const Settings = ({
  fetchTheme,
  filters,
  isOpen,
  setIsOpen,
  isHome,
  installPwaPrompt,
}: SettingsProps) => {
  return (
    <div className="h-full w-full select-none space-y-4 overflow-hidden rounded-xl p-4 shadow-default ring-1 ring-neutral-200/30 dark:bg-neutral-800/70 dark:ring-neutral-400/20">
      {/* Title */}
      <div className="text-center text-lg font-medium">Settings</div>
      <div className="border-b border-neutral-200/80 dark:border-neutral-400/30" />
      {/* Configs */}
      <Themes
        fetchTheme={fetchTheme}
        filters={filters}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isHome={isHome}
      />
      <DarkModeToggler />
      <Install installPwaPrompt={installPwaPrompt} />
    </div>
  );
};

export default Settings;
