import { useState, ReactNode, useEffect } from "react";

import Link from "next/link";

import Sidebar from "../Sidebar";
import Notifications from "../Notifications";

import styles from "./layout.module.scss";

import { useTheme } from "next-themes";

interface ILayoutProps {
  children: ReactNode;
  isHome: boolean;
  filters: any;
  handleFilters: any;
  saveTheme: () => void;
}

const Layout = ({
  children,
  isHome,
  filters,
  handleFilters,
  saveTheme,
}: ILayoutProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hamburgerLine = `h-1 w-6 my-0.5 rounded-full bg-black transition ease transform duration-300 dark:bg-neutral-200 bg-neutral-900`; 
  const { resolvedTheme } = useTheme();
  const [logo, setLogo] = useState(null);

  // necesary so logo renders only on the client
  useEffect(() => setLogo(
    <picture>
      <img
        className="h-[46px] w-auto"
        src={resolvedTheme === "dark" ? "/calendarium-dark.svg" : "/calendarium-light.svg"}
        alt="Calendarium Logo"
      />
    </picture>
  ), [resolvedTheme]);

  return (
    <div className="text-neutral-900 lg:flex dark:bg-neutral-900 dark:text-neutral-200">
      {/* Open/Close Sidebar Button */}
      <button
        className="group absolute z-20 ml-8 mt-8 flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-white dark:bg-neutral-800/70 shadow-md ring-1 ring-neutral-100/50 dark:ring-neutral-400/20 lg:hidden"
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

      {/* Notification Badges */}
      <Notifications isOpen={isOpen} />

      {/* Calendarium Logo */}
      <div className="px-8 pt-8 lg:hidden">
        <div
          style={{ cursor: "pointer", width: "fit-content", margin: "auto" }}
        >
          <Link href="/">
            {logo}
          </Link>
        </div>
      </div>

      {/* Sidebar */}
      <div>
        <Sidebar
          isHome={isHome}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          filters={filters}
          handleFilters={handleFilters}
          saveTheme={saveTheme}
        />
      </div>

      {/* Feedback Button */}
      <div
        className={`fixed bottom-0 right-0 z-20 transform pb-4 pr-4 transition duration-300 lg:translate-y-0 ${
          !isOpen && "translate-y-full"
        }`}
      >
        <button
          onClick={() => window.open("https://forms.gle/C2uxuUKqoeqMWfcZ6")}
          className={styles.buttonBug}
        >
          <div>
            <p>Feedback</p> <i className="bi bi-chat-fill"></i>
          </div>
        </button>
      </div>

      {/* Children */}
      <main className="h-[calc(100vh-4.9rem)] w-full flex-1 px-8 py-8  lg:ml-96 lg:h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;
