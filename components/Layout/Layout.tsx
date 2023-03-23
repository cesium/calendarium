import { useState, ReactNode } from "react";

import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import Footer from "../Footer";

interface ILayoutProps {
  children: ReactNode;
  isHome?: boolean;
  filters?: any;
  handleFilters?: any;
}

const Layout = ({ children, isHome, filters, handleFilters }: ILayoutProps) => {
  return (
    <div className="flex overflow-auto">
      <div className="py-8">
        <Sidebar
          isHome={isHome}
          filters={filters}
          handleFilters={handleFilters}
        />
      </div>
      <main className="flex-1 px-8 py-8">{children}</main>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
