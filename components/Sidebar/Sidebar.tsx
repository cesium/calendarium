import { useState, useEffect } from "react";

import Link from "next/link";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import EventFilters from "../EventFilters";
import ScheduleFilters from "../ScheduleFilters";
import Settings from "../Settings";
import ExportButton from "../ExportButton";
import ClearScheduleButton from "../ClearScheduleButton";
import NavigationPane from "../NavigationPane";

import { IFilterDTO } from "../../dtos";
import ShareButton from "../ShareButton";

import { SelectedShift } from "../../types";

import {useTheme} from 'next-themes';

interface ISidebarProps {
  isHome?: boolean;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  filters?: IFilterDTO[];
  handleFilters?: any;
  saveTheme: () => void;
}

const Sidebar = ({
  isHome,
  isOpen,
  setIsOpen,
  filters,
  handleFilters,
  saveTheme,
}: ISidebarProps) => {
  const [isSettings, setIsSettings] = useState(false);
  const [clear, setClear] = useState(false);
  const [checked, setChecked] = useState<number[] | SelectedShift[]>([]);

  function clearSelection() {
    setClear(true);
    setTimeout(() => setClear(false), 300);
  }

  const exportPDF = async () => {
    const input = document.getElementById(isHome ? "APP" : "SCHEDULE");
    const canvas = await html2canvas(input, { logging: true });
    const imgwidth = 208;
    const imgHeight = (canvas.height * imgwidth) / canvas.width;
    const imgData = canvas.toDataURL("img/png");
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, imgwidth, imgHeight);
    pdf.save("calendario.pdf");
  };

  const sidebar = `lg:w-96 lg:block lg:translate-x-0 lg:h-full h-mobile lg:shadow-md lg:border-y lg:border-r dark:border-neutral-400/30 w-full absolute overflow-y-scroll overflow-x-hidden lg:overflow-y-scroll lg:rounded-r-3xl lg:py-8 pb-8 px-8 bg-white dark:bg-neutral-900 z-10 transition ease transform duration-300`;

  const { theme } = useTheme();
  const [logo, setLogo] = useState(null);

  // necesary so logo renders only on the client
  useEffect(() => setLogo(
    <picture>
      <img
        className="h-[46px] w-auto"
        src={theme === "dark" ? "/calendarium-dark.svg" : "/calendarium-light.svg"}
        alt="Calendarium Logo"
      />
    </picture>
  ), [theme]);

  return (
    <div
      className={`${sidebar} ${isOpen ? "block" : "-translate-x-full"}`}
      style={{ direction: "rtl" }}
    >
      <div className="grid-cols-1 space-y-6" style={{ direction: "ltr" }}>
        {/* Calendarium Logo (only shows on large screens) */}
        <div className="hidden lg:block">
          <div
            style={{ cursor: "pointer", width: "fit-content", margin: "auto" }}
          >
            <Link href="https://cesium.link/">
              {logo}
            </Link>
          </div>
        </div>

        {/* Page Links */}
        <NavigationPane />

        <div className="space-y-2">
          <div className="flex space-x-2">
            {/* Settings Button */}
            <div className="flex space-x-2">
              <button
                onClick={() => setIsSettings(!isSettings)}
                className="dark:bg-neutral-800/70 h-10 w-10 rounded-xl p-2 leading-3 text-neutral-300 dark:text-neutral-500 shadow-md ring-1 ring-neutral-200/50 dark:ring-neutral-400/20 transition-all duration-300 hover:text-neutral-900 dark:hover:text-neutral-200 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500"
                title="Settings"
              >
                {isSettings ? (
                  <i className="bi bi-gear-fill text-neutral-900 dark:text-neutral-200"></i>
                ) : (
                  <i className="bi bi-gear-fill"></i>
                )}
              </button>
              {/* Share Button */}
              <ShareButton
                isHome={isHome}
                filters={filters}
                handleFilters={handleFilters}
                setChecked={setChecked}
              />
              {/* Clear Schedule button */}
              <ClearScheduleButton
                isHome={isHome}
                isSettings={isSettings}
                clearSelection={clearSelection}
              />
            </div>
            {/* Export button */}
            <ExportButton
              exportPDF={exportPDF}
              isHome={isHome}
              filters={filters}
            />
          </div>
        </div>

        {isSettings ? (
          <Settings
            saveTheme={saveTheme}
            filters={filters}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isHome={isHome}
          />
        ) : isHome ? (
          <EventFilters
            filters={filters}
            handleFilters={(myFilters) => handleFilters(myFilters)}
            clearEvents={clear}
            checked={checked}
            setChecked={setChecked}
          />
        ) : (
          <ScheduleFilters
            filters={filters}
            handleFilters={(myFilters) => handleFilters(myFilters)}
            clearSchedule={clear}
            checked={checked}
            setChecked={setChecked}
          />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
