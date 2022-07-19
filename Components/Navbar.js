import React, { useState } from "react";
import Link from "next/link";
import { navbarItems } from "./NavItems";
import Dropdown from "./Dropdown";

export default function Navbar() {
    const [dropdown, setDropdown] = useState(false);

    return (
        <nav className="navbar">
            <Link href="https://cesium.link/">
                <img src="./cesium-full-logo.png" className="nav-cesium-logo" />
            </Link>
            <Dropdown />
        </nav>
    );
}
