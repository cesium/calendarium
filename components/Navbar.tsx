import Link from "next/link";
import Image from "next/image";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useTheme } from "./Theme/Theme";

const dark = {
  display: "flex",
  justifyContent: "center",
  width: "150px",
  color: "white",
};
const light = {
  display: "flex",
  justifyContent: "center",
  width: "150px",
  color: "black",
};

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  if (isDark) {
    document.body.classList.add("dark");
  }

  const exportPDF = () => {
    const input = document.getElementById("APP")!;
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

  const darkMode = () => {
    const body = document.querySelector("body");
    body?.classList.toggle("dark");
  };

  function DarkModeToggle({ visible }) {
    return (
      visible && (
        <button className="btn" onClick={toggleTheme}>
          {isDark ? (
            <div style={dark}>
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
            </div>
          ) : (
            <div style={light}>
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
            </div>
          )}
        </button>
      )
    );
  }

  return (
    <nav className="navbar">
      {isDark ? (
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
            src="/cesium-DARK.svg"
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
          <DarkModeToggle visible={true} />
        </button>
      </div>
    </nav>
  );
}
