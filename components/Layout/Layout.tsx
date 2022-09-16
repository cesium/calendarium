import React, { ReactNode } from "react";
import Image from "next/image";
import styles from "./layout.module.scss";
import Navbar from "../Navbar";
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
        {isDark ? (
          <Image
            width={21}
            height={21}
            src="/cesium-LIGHT.svg"
            alt="Logo do Cesium"
          />
        ) : (
          <Image
            width={21}
            height={21}
            src="/cesium-DARK.svg"
            alt="Logo do Cesium"
          />
        )}
      </footer>
    </>
  );
};

export default Layout;
