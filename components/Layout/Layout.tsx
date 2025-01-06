import { useState, ReactNode, useEffect } from "react";
import Link from "next/link";
import Sidebar from "../Sidebar";
import Notifications from "../Notifications";
import styles from "./layout.module.scss";
import { useTheme } from "next-themes";
import Head from "next/head";
import Image from "next/image";
import { AppInfoProvider } from "../../contexts/AppInfoProvider";

interface ILayoutProps {
  children: ReactNode;
  isEvents: boolean;
  filters: any;
  handleFilters: any;
  fetchTheme: () => void;
}

const Layout = ({
  children,
  isEvents,
  filters,
  handleFilters,
  fetchTheme,
}: ILayoutProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hamburgerLine = `h-1 w-6 my-0.5 rounded-full bg-black transition ease transform duration-300 dark:bg-neutral-200 bg-neutral-900`;
  const [image, setImage] = useState<string>("");
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setImage(
      resolvedTheme === "dark"
        ? "/calendarium-dark.svg"
        : "/calendarium-light.svg"
    );
  }, [resolvedTheme]);

  return (
    <AppInfoProvider
      data={{
        isEvents,
        filters,
        handleFilters,
        fetchTheme,
      }}
    >
      <div className="text-neutral-900 dark:text-neutral-200 lg:flex">
        <Head>
          {/* Status Bar configuration for Android devices */}
          <meta
            name="theme-color"
            content={resolvedTheme === "dark" ? "#171717" : "#ffffff"}
          />
          {/* Status Bar configuration for IOS devices */}
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content={resolvedTheme === "dark" ? "black-translucent" : "default"}
          />
        </Head>
        {/* Open/Close Sidebar Button */}
        <button
          className="absolute left-8 top-8 z-20 flex h-10 w-10 flex-col items-center justify-center rounded-xl bg-white shadow-md ring-1 ring-neutral-100/50 dark:bg-neutral-800/70 dark:ring-neutral-400/20 min-[400px]:h-11 min-[400px]:w-11 sm:h-12 sm:w-12 lg:hidden"
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
      </div>
      {/* Calendarium Logo */}
      <div className="px-8 pt-8 lg:hidden">
        <div className="mx-auto flex h-10 w-fit cursor-pointer items-center min-[400px]:h-11 sm:h-12">
          <Link href="/">
            <Image
              className="h-9 w-auto min-[400px]:h-10 sm:h-12"
              width={0}
              height={0}
              src={image}
              alt="Calendarium Logo"
            />
          </Link>
        </div>

        {/* Sidebar */}
        <div>
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
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
        <main className="h-[calc(100dvh-4.9rem)] w-full flex-1 px-8 py-8  lg:ml-96 lg:h-screen">
          {children}
        </main>
      </div>
    </AppInfoProvider>
  );
};

export default Layout;
