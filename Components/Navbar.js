import React from "react";
import Link from "next/link";
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

    return (
        <nav className="navbar">
            <Link href="https://cesium.link/">
                <img src="./cesium-full-logo.png" className="nav-cesium-logo" />
            </Link>
            <img src="./calendar-icon.ico" />
            <button onClick={() => exportPDF()} className="navbar-button-pdf">
                Extract to PDF
            </button>
        </nav>
    );
}
