import { useState, ReactNode, useEffect } from "react";
import Link from "next/link";
import Sidebar from "../Sidebar";
import Notifications from "../Notifications";
import { useTheme } from "next-themes";
import Head from "next/head";
import Image from "next/image";
import { AppInfoProvider } from "../../contexts/AppInfoProvider";
import MoreButton from "../MoreButton";
import { ISelectedFilterDTO } from "../../dtos";

interface ILayoutProps {
  children: ReactNode;
  isEvents: boolean;
  filters: any;
  handleFilters: (filters: ISelectedFilterDTO[]) => void;
  fetchTheme: () => void;
  handleData?: (_: boolean) => void;
}

const Layout = ({
  children,
  isEvents,
  filters,
  handleFilters,
  fetchTheme,
  handleData,
}: ILayoutProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hamburgerLine = `h-1 w-6 my-0.5 rounded-full bg-black transition ease transform duration-300 dark:bg-neutral-200 bg-neutral-900`;
  const [image, setImage] = useState<string>("/calendarium-light.svg");
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
        image,
        handleData,
      }}
    >
      <div className="flex h-dvh flex-col text-neutral-900 dark:text-neutral-200 lg:flex-row">
        <Head>
          {/* Status Bar configuration for Android devices */}
          <meta
            name="theme-color"
            content={resolvedTheme === "dark" ? "#171717" : "#ffffff"}
          />
          {/* Status Bar configuration for IOS devices */}
          <meta
            name="mobile-web-app-status-bar-style"
            content={resolvedTheme === "dark" ? "black-translucent" : "default"}
          />
        </Head>
        {/* Open/Close Sidebar Button */}
        <button
          className="absolute left-4 top-4 z-20 flex h-10 w-10 flex-col items-center justify-center rounded-xl bg-white shadow-md ring-1 ring-neutral-100/50 dark:bg-[#212121] dark:ring-neutral-400/20 min-[400px]:h-11 min-[400px]:w-11 sm:left-6 sm:top-6 sm:h-12 sm:w-12 lg:hidden"
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
        <div className="px-4 pt-4 sm:px-6 sm:pt-6 lg:hidden">
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
        </div>

        {/* Sidebar */}
        <div>
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>

        {/* More Button */}
        <MoreButton isOpen={isOpen} />

        {/* Children */}
        <main className="w-full flex-1 lg:ml-96">{children}</main>
      </div>
    </AppInfoProvider>
  );
};

export default Layout;
