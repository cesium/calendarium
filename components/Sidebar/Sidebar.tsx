import { useState } from "react";

import Link from "next/link";
import Image from "next/image";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import styles from "./sidebar.module.scss";

import ActiveLink from "../ActiveLink";
import EventFilters from "../EventFilters";
import ScheduleFilters from "../ScheduleFilters";
import Settings from "../Settings";
import ExportButton from "../ExportButton";
import ClearScheduleButton from "../ClearScheduleButton";

import { IFilterDTO } from "../../dtos";
import { useDarkMode } from "../../context/DarkMode";

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

  function clearSchedule() {
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

  const sidebar = `lg:w-96 lg:block lg:translate-x-0 lg:h-full h-mobile lg:shadow-md lg:border w-full absolute overflow-y-scroll overflow-x-hidden lg:overflow-y-scroll lg:rounded-r-3xl lg:py-8 pb-8 px-8 bg-white dark:bg-slate-600 z-10 transition ease transform duration-300`;

  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div
      className={`${sidebar} ${isOpen ? "block" : "-translate-x-full"} dark:bg-slate-700 `}
      style={{ direction: "rtl" }}
    >
      <button onClick={toggleDarkMode}> {String(isDarkMode)}</button>

      <div className="grid-cols-1 space-y-6" style={{ direction: "ltr" }}>
        <div className="hidden lg:block">
          <div
            style={{ cursor: "pointer", width: "fit-content", margin: "auto" }}
          >
            <Link href="https://cesium.link/">
              <Image
                width={260.89}
                height={46}
                src={"/calendarium-light.svg"}
                alt="CeSIUM Link"
              />
            </Link>
          </div>
        </div>

        <div>
          <div className={styles.links}>
            <div style={{ width: "fit-content", margin: "auto" }}>
              <ActiveLink href="/" activeClassName={styles.activeLink}>
                <text>
                  <i className="bi bi-calendar-fill"></i> EVENTS
                </text>
              </ActiveLink>
              <ActiveLink href="/schedule" activeClassName={styles.activeLink}>
                <text>
                  <i className="bi bi-clock-fill"></i> SCHEDULE
                </text>
              </ActiveLink>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex space-x-2">
            {/* Settings Button */}
            <button
              onClick={() => setIsSettings(!isSettings)}
              className="h-10 w-12 rounded-2xl bg-gray-400 p-2 text-white shadow-md transition-shadow duration-300 hover:shadow-lg hover:shadow-gray-400/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
              title="Settings"
            >
              {isSettings ? (
                <i className="bi bi-gear-fill"></i>
              ) : (
                <i className="bi bi-gear"></i>
              )}
            </button>
            {/* Export button */}
            <ExportButton
              exportPDF={exportPDF}
              isHome={isHome}
              filters={filters}
            />
          </div>
          {/* Clear Schedule button */}
          {!isHome && (
            <ClearScheduleButton
              isSettings={isSettings}
              clearSchedule={clearSchedule}
            />
          )}
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
          />
        ) : (
          <ScheduleFilters
            filters={filters}
            handleFilters={(myFilters) => handleFilters(myFilters)}
            clearSchedule={clear}
          />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
