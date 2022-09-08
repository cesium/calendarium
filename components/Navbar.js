import Link from "next/link";
import Image from "next/image";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useState } from "react";
import DarkModeToggle from "./DarkModeToggle";

export default function Navbar({ landing }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const exportPDF = () => {
    const input = document.getElementById("APP");
    html2canvas(input, {
      logging: true,
      letterRendering: 1,
      userCors: true,
    }).then((canvas) => {
      const imgwidth = 208;
      const imgHeight = (canvas.height * imgwidth) / canvas.width;
      const imgData = canvas.toDataURL("img/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, imgwidth, imgHeight);
      pdf.save("calendario.pdf");
    });
  };

  const darkMode = () => {
    const body = document.querySelector("body");
    body.classList.toggle("dark");
    setIsDarkMode(!isDarkMode);
  };

  return (
    <nav className="navbar">
      {isDarkMode ? (
        <Link href="https://cesium.link/">
          <Image
            width={100}
            height={21}
            src="/cesium-LIGHT.svg"
            className="nav-cesium-logo"
            alt="CeSIUM Link"
          />
        </Link>
      ) : (
        <Link href="https://cesium.link/">
          <Image
            width={100}
            height={21}
            src="/cesium-full-logo.png"
            className="nav-cesium-logo"
            alt="CeSIUM Link"
          />
        </Link>
      )}

      <Image
        width={32}
        height={21}
        src="/calendar-icon.ico"
        alt="Calendarium"
      />
      <div className="navbar-buttons">
        <button onClick={() => exportPDF()} className="navbar-button-pdf">
          Extract to PDF
        </button>
        <button onClick={() => darkMode()} className="navbar-button-dark">
          <DarkModeToggle visible={!landing} />
        </button>
      </div>
    </nav>
  );
}
