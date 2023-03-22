import Link from "next/link";
import Image from "next/image";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ActiveLink from "../ActiveLink";
import styles from "./navbar.module.scss";

interface INavbarProps {
  isHome?: boolean;
}

const Navbar = ({ isHome }: INavbarProps) => {
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
    <nav className={styles.navbar}>
      <div className={styles.cesiumLogo}>
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

      <div className={styles.navbarButtons}>
        <button onClick={() => exportPDF()} className={styles.buttonPdf}>
          Export <i className="bi bi-file-earmark-pdf-fill"></i>
        </button>
      </div>

      <div className={styles.links}>
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
