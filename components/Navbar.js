import Link from "next/link";
import Image from "next/image";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Navbar() {
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
    btn.innerHTML = "Light Mode";
  };

  return (
    <nav className="navbar">
      <Link href="https://cesium.link/">
        <Image
          width={100}
          height={21}
          src="/cesium-full-logo.png"
          className="nav-cesium-logo"
          alt="CeSIUM Link"
        />
      </Link>

      <Image
        width={32}
        height={21}
        src="/calendar-icon.ico"
        alt="Calendarium"
      />
      <div className="navbar-buttons">
        <button onClick={() => darkMode()} className="navbar-darkmode-btn">
          darkMode
        </button>
        <button onClick={() => exportPDF()} className="navbar-button-pdf">
          Extract to PDF
        </button>
      </div>
    </nav>
  );
}
