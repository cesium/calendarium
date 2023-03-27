import { useState, ReactNode } from "react";

import Link from "next/link";
import Image from "next/image";

import Sidebar from "../Sidebar";

import styles from "./layout.module.scss";

interface ILayoutProps {
  children: ReactNode;
  isHome?: boolean;
  filters?: any;
  handleFilters?: any;
}

const Layout = ({ children, isHome, filters, handleFilters }: ILayoutProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hamburgerLine = `h-1 w-6 my-0.5 rounded-full bg-black transition ease transform duration-300`;

  return (
    <div className="lg:flex">
      <button
        className="group absolute z-20 mt-8 ml-8 flex h-12 w-12 flex-col items-center justify-center rounded-2xl bg-white shadow-md lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className={`${hamburgerLine} ${
            isOpen
              ? "translate-y-2 rotate-45 opacity-50 group-hover:opacity-100"
              : "opacity-50 group-hover:opacity-100"
          }`}
        />
        <div
          className={`${hamburgerLine} ${
            isOpen ? "opacity-0" : "opacity-50 group-hover:opacity-100"
          }`}
        />
        <div
          className={`${hamburgerLine} ${
            isOpen
              ? "-translate-y-2 -rotate-45 opacity-50 group-hover:opacity-100"
              : "opacity-50 group-hover:opacity-100"
          }`}
        />
      </button>

      <div className="px-8 pt-8 lg:hidden">
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
        <Sidebar
          isHome={isHome}
          isOpen={isOpen}
          filters={filters}
          handleFilters={handleFilters}
        />
      </div>

      <div className={`z-20 lg:block ${isOpen ? "block" : "hidden"}`}>
        <button
          onClick={() => window.open("https://forms.gle/C2uxuUKqoeqMWfcZ6")}
          className={styles.buttonBug}
        >
          <div>
            <a>Report Bug</a> <i className="bi bi-bug-fill"></i>
          </div>
        </button>
      </div>

      <main className="flex-1 px-8 py-8 lg:ml-96">{children}</main>
    </div>
  );
};

export default Layout;
