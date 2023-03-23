import Link from "next/link";
import Image from "next/image";

import { useState } from "react";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import styles from "./sidebar.module.scss";

import ActiveLink from "../ActiveLink";
import EventFilters from "../EventFilters";
import ScheduleFilters from "../ScheduleFilters";

interface ISidebarProps {
  isHome?: boolean;
  filters?: any;
  handleFilters?: any;
}

const Sidebar = ({ isHome, filters, handleFilters }: ISidebarProps) => {
  const exportPDF = () => {
    const input = document.getElementById(isHome ? "APP" : "SCHEDULE");

    html2canvas(input, {
      logging: true,
    }).then((canvas) => {
      const imgwidth = 208;
      const imgHeight = (canvas.height * imgwidth) / canvas.width;
      const imgData = canvas.toDataURL("img/png");
      const pdf = new jsPDF("p", "mm", "a4");

      pdf.addImage(imgData, "PNG", 0, 0, imgwidth, imgHeight);
      pdf.save("calendario.pdf");
    });
  };

  return (
    <div className="width-96 h-full grid-cols-1 space-y-6 rounded-2xl pl-8">
      <div className="w-fit m-auto flex">
        <div style={{ cursor: "pointer" }}>
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

      {/* <div className="w-fit m-auto">
                <button onClick={() => exportPDF()} className={styles.buttonPdf}>
                    Export <i className="bi bi-file-earmark-pdf-fill"></i>
                </button>
            </div> */}

      <div className="">
        <div className={styles.links}>
          <div className="ml-2">
            <ActiveLink href="/" activeClassName={styles.activeLink}>
              <a>
                <i className="bi bi-calendar-fill"></i> EVENTS
              </a>
            </ActiveLink>
            <ActiveLink href="/schedule" activeClassName={styles.activeLink}>
              <a>
                <i className="bi bi-clock-fill"></i> SCHEDULE
              </a>
            </ActiveLink>
          </div>
        </div>
      </div>

      {isHome ? (
        <EventFilters
          filters={filters}
          handleFilters={(myFilters) => handleFilters(myFilters)}
        />
      ) : (
        <ScheduleFilters
          filters={filters}
          handleFilters={(myFilters) => handleFilters(myFilters)}
        />
      )}
    </div>
  );
};

export default Sidebar;
