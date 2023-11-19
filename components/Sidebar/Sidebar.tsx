import { useState } from "react";

import Link from "next/link";
import Image from "next/image";

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

  const sidebar = `lg:w-96 lg:block lg:translate-x-0 lg:h-full h-mobile lg:shadow-md lg:border w-full absolute overflow-y-scroll overflow-x-hidden lg:overflow-y-scroll lg:rounded-r-3xl lg:py-8 pb-8 px-8 bg-white z-10 transition ease transform duration-300`;

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
              <Image
                width={260.89}
                height={46}
                src={"/calendarium-light.svg"}
                alt="CeSIUM Link"
              />
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
                className="h-10 w-10 rounded-xl p-2 leading-3 text-gray-300 shadow-md ring-1 ring-zinc-200/50 transition-all duration-300 hover:text-gray-900 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
                title="Settings"
              >
                {isSettings ? (
                  <i className="bi bi-gear-fill text-gray-900"></i>
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
