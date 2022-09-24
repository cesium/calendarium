import React, { ReactNode } from "react";

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
    <div style={{ overflow: "auto" }}>
      <div className={styles.main}>
        <Navbar isHome={isHome} />
      </div>

      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default Layout;
