import React, { useState } from "react";
import { dropdownItems } from "./NavItems";

export default function Dropdown() {
    const [dropdown, setDropdown] = useState(false);
    const onClick = () => setDropdown(!dropdown);

    return (
        <div>
            <button onClick={onClick} className="button">
                Calendar Filters
            </button>
            <ul
                className={`menu ${dropdown ? "active" : "inactive"}`}
                onClick={() => setDropdown(!dropdown)}
            >
                {dropdownItems.map((item) => {
                    return (
                        <li key={item.id} className={item.cName}>
                            {item.title}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
