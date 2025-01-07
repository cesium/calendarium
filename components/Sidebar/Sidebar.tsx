import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import EventFilters from "../EventFilters";
import ScheduleFilters from "../ScheduleFilters";
import Settings from "../Settings";
import ExportButton from "../ExportButton";
import ClearSelectionButton from "../ClearSelectionButton";
import NavigationPane from "../NavigationPane";
import ShareButton from "../ShareButton";
import { BeforeInstallPromptEvent } from "../../types";
import { useAppInfo } from "../../contexts/AppInfoProvider";
import { ISelectedFilterDTO } from "../../dtos";

type SidebarProps = {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
};

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const [isSettings, setIsSettings] = useState(false);
  const [clear, setClear] = useState(false);
  const [checked, setChecked] = useState<number[] | ISelectedFilterDTO[]>([]);
  const [promptInstall, setPromptInstall] =
    useState<BeforeInstallPromptEvent>(null);

  function clearSelection() {
    setClear(true);
    setTimeout(() => setClear(false), 300);
  }

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setPromptInstall(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("transitionend", handler);
  }, []);

  const sidebar = `lg:w-96 lg:block lg:translate-x-0 lg:h-full h-mobile lg:shadow-md lg:border-r dark:border-neutral-400/30 w-full absolute overflow-y-auto overflow-x-hidden lg:overflow-y-auto lg:rounded-r-3xl p-4 sm:p-6 bg-white dark:bg-neutral-900 z-10 transition ease transform duration-300`;

  const info = useAppInfo();

  return (
    <nav
      className={`${sidebar} ${isOpen ? "block" : "-translate-x-full"}`}
      style={{ direction: "rtl" }}
    >
      <div
        className="flex flex-col gap-4 sm:gap-6"
        style={{ direction: "ltr" }}
      >
        {/* Calendarium Logo (only shows on large screens) */}
        <div className="hidden lg:block">
          <div
            style={{ cursor: "pointer", width: "fit-content", margin: "auto" }}
          >
            <Link href="/">
              <Image
                className="h-[46px] w-auto"
                width={0}
                height={0}
                src={info.image}
                alt="Calendarium Logo"
              />
            </Link>
          </div>
        </div>

        {/* Page Links */}
        <NavigationPane />

        <div className="flex gap-3 sm:gap-4">
          <div className="flex gap-3 sm:gap-4">
            {/* Settings Button */}
            <button
              onClick={() => setIsSettings(!isSettings)}
              className="h-10 w-10 rounded-xl p-2 leading-3 text-neutral-300 shadow-md ring-1 ring-neutral-200/50 transition-all duration-300 hover:text-neutral-900 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500 dark:bg-neutral-800/70 dark:text-neutral-500 dark:ring-neutral-400/20 dark:hover:text-neutral-200"
              title="Settings"
              data-umami-event="settings-button"
            >
              {isSettings ? (
                <i className="bi bi-gear-fill text-neutral-900 dark:text-neutral-200"></i>
              ) : (
                <i className="bi bi-gear-fill"></i>
              )}
            </button>
            {/* Clear Schedule button */}
            <ClearSelectionButton
              isSettings={isSettings}
              clearSelection={clearSelection}
            />
            {/* Share Button */}
            <ShareButton setChecked={setChecked} />
          </div>
          {/* Export button */}
          <ExportButton />
        </div>

        {isSettings ? (
          <Settings
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            installPwaPrompt={promptInstall}
          />
        ) : info.isEvents ? (
          <EventFilters
            clearEvents={clear}
            checked={checked}
            setChecked={setChecked}
          />
        ) : (
          <ScheduleFilters
            clearSchedule={clear}
            checked={checked}
            setChecked={setChecked}
          />
        )}
      </div>
    </nav>
  );
};

export default Sidebar;
