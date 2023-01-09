import Link from "next/link";
import Image from "next/image";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { useTheme } from "../Theme/Theme";
import ActiveLink from "../ActiveLink";

import styles from "./navbar.module.scss";

interface INavbarProps {
  isHome?: boolean;
}

const Navbar = ({ isHome }: INavbarProps) => {
  const { isDark, toggleTheme } = useTheme();
  if (isDark) {
    document.body.classList.add("dark");
  }

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

  const darkMode = () => {
    const body = document.querySelector("body");

    body.classList.toggle("dark");
  };

  function DarkModeToggle({ visible }) {
    return (
      visible && (
        <button className="btn" onClick={toggleTheme}>
          {isDark ? (
            <div className={styles.dark}>
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
            <div className={styles.light}>
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
    <nav className={styles.navbar}>
      <div className={styles.cesiumLogo}>
        <div>
          <Link href="https://cesium.link/">
            <Image
              width={198}
              height={46}
              src={isDark ? "/calendarium-banner-dark.png" : "/calendarium-banner-light.png"}
              alt="CeSIUM Link"
            />
          </Link>
        </div>
      </div>

      <div className={styles.navbarButtons}>
        <button onClick={() => exportPDF()} className={styles.buttonPdf}>
          Export <i className="bi bi-file-earmark-pdf-fill"></i>
        </button>
      </div>

      <div className={`${styles.links} ${isDark ? styles.darkLink : ""}`}>
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
    </nav>
  );
};

export default Navbar;
