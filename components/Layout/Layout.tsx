import React, { ReactNode } from "react";
import Image from "next/image";

import Navbar from "../Navbar";

import styles from "./layout.module.scss";

import { useTheme } from "../Theme/Theme";

interface ILayoutProps {
  children: ReactNode;
  isHome?: boolean;
}

const Layout = ({ children, isHome }: ILayoutProps) => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <>
      <Navbar isHome={isHome} />

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
          <Image
            width={100}
            height={36}
            src={isDark ? "/cesium-LIGHT.svg" : "/cesium-DARK.svg"}
            alt="CeSIUM Logo"
          />
      </footer>
    </>
  );
};

export default Layout;
