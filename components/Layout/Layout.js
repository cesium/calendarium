import Image from "next/image";

import { Navbar } from "../Navbar";

import styles from "./layout.module.scss";

export const Layout = ({ children, isHome }) => {
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
