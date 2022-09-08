import Link from "next/link";
import Image from "next/image";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useState } from "react";

export default function Navbar() {
  const [theme, setTheme] = useLocalStorage("dark", "light");

  function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
      if (typeof window === "undefined") {
        return initialValue;
      }
      try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.log(error);
        return initialValue;
      }
    });
    const setValue = (value) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.log(error);
      }
    };
    return [storedValue, setValue];
  }

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
    const btn = document.querySelector(".navbar-darkmode-btn");
    theme === "dark" ? setTheme("light") : setTheme("dark");
  };

  return (
    <nav className="navbar">
      {theme == "light" && (
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

      {theme == "dark" && (
        <Link href="https://cesium.link/">
          <Image
            width={100}
            height={21}
            src="/cesium-LIGHT.svg"
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
        {theme == "light" && (
          <button onClick={() => darkMode()} className="navbar-darkmode-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              role="img"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              ></path>
            </svg>
          </button>
        )}
        {theme == "dark" && (
          <button onClick={() => darkMode()} className="navbar-darkmode-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              role="img"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              ></path>
            </svg>
          </button>
        )}
      </div>
    </nav>
  );
}
