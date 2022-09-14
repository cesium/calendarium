import React, { ReactNode } from "react";
import Image from "next/image";

import { Navbar } from "../Navbar";

import styles from "./layout.module.scss";

interface ILayoutProps {
  children: ReactNode;
  isHome?: boolean;
}

export const Layout = ({ children, isHome }: ILayoutProps) => {
  return (
    <>
      <Navbar isHome={isHome} />

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <Image
          width={21}
          height={21}
          src="/cesium-full-logo.png"
          alt="Logo do Cesium"
        />
      </footer>
    </>
  );
};
