import { useEffect, useState, useMemo } from "react";

import { Switch } from "@headlessui/react";

import { HexColorPicker } from "react-colorful";

const Settings = ({ saveTheme }) => {
  const defaultColors = [
    "#f07c54", // cesium
    "#4BC0D9", // 1st year
    "#7b54f0", // 2nd year
    "#f0547b", // 3rd year
    "#5ac77b", // 4th year
    "#395B50", // 5th year
    "#b70a0a", // uminho
    "#3408fd", // sei
    "#642580", // coderdojo
    "#FF0000", // join
    "#1B69EE", // jordi
  ];

  const [theme, setTheme] = useState<string>("Modern");
  const [colors, setColors] = useState<string[]>(defaultColors);
  const [opacity, setOpacity] = useState<boolean>(true);
  const [openColor, setOpenColor] = useState<number>(1);
  const [customType, setCustomType] = useState<string>("Year");

  function updateColors(newColor: string) {
    const newColors = [...colors];
    newColors[openColor] = newColor;
    setColors(newColors);
    localStorage.setItem("colors", newColors.join(","));
  }

  function updateTheme(newTheme: string) {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  }

  function updateOpacity(updateOpacity: boolean) {
    setOpacity(updateOpacity);
    localStorage.setItem("opacity", updateOpacity.toString());
  }

  function updateCustomType(newCustomType: string) {
    setCustomType(newCustomType);
    localStorage.setItem("customType", newCustomType);
  }

  function backToDefault() {
    setColors(defaultColors);
    setOpacity(true);
    localStorage.setItem("colors", defaultColors.join(","));
    localStorage.setItem("opacity", "true");
  }

  function getSettings() {
    const theme = localStorage.getItem("theme");
    const colors = localStorage.getItem("colors");
    const opacity = localStorage.getItem("opacity");
    const customType = localStorage.getItem("customType");

    if (theme) setTheme(theme);

    if (colors) setColors(colors.split(","));

    if (opacity) setOpacity(opacity === "true");

    if (customType) setCustomType(customType);
  }

  useEffect(() => {
    getSettings();
  }, []);

  return (
    <div className="h-full w-full space-y-4 rounded-2xl p-4 shadow-default">
      <div className="text-center text-lg font-medium text-gray-900">
        Settings
      </div>
      <div className="border-b" />
      <div>
        <label
          htmlFor="theme"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Theme
        </label>
        <select
          id="theme"
          name="theme"
          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-cesium-400"
          defaultValue="Modern"
          value={theme}
          onChange={(e) => updateTheme(e.target.value)}
        >
          <option>Modern</option>
          <option>Classic</option>
          <option>Custom</option>
        </select>
      </div>

      {theme === "Custom" && (
        <>
          <div className="flex flex-row place-content-between items-center">
            <label
              htmlFor="theme"
              className="w-full text-sm font-medium text-gray-900"
            >
              Customize by:
            </label>
            <select
              id="theme"
              name="theme"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-cesium-400"
              defaultValue="Year"
              value={customType}
              onChange={(e) => updateCustomType(e.target.value)}
            >
              <option>Year</option>
              <option>Subject</option>
            </select>
          </div>

          {customType === "Year" ? (
            <div className="space-y-4">
              <div className="flex flex-row place-content-center items-center space-x-2">
                <div className="w-full flex-col space-y-1">
                  {colors.slice(1, 6).map((color, index) => (
                    <button
                      key={index}
                      className="flex h-9 w-full place-content-center items-center rounded-lg text-white"
                      style={{ backgroundColor: color }}
                      onClick={() => setOpenColor(index + 1)}
                    >
                      {index + 1}º
                    </button>
                  ))}
                </div>
                <div className="">
                  <HexColorPicker
                    color={colors[openColor]}
                    onChange={(newColor) => updateColors(newColor)}
                  />
                </div>
              </div>
              <div className="flex flex-row place-content-between">
                <Switch.Group as="div" className="flex items-center">
                  <Switch
                    checked={opacity}
                    onChange={updateOpacity}
                    className={`${
                      opacity ? "bg-cesium-400" : "bg-gray-200"
                    } ${"relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"}`}
                  >
                    <span className="sr-only">Use setting</span>
                    <span
                      aria-hidden="true"
                      className={`${
                        opacity ? "translate-x-5" : "translate-x-0"
                      } ${"pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"}`}
                    />
                  </Switch>
                  <Switch.Label
                    as="span"
                    className="ml-3 text-sm font-medium text-gray-900"
                  >
                    Opacity
                  </Switch.Label>
                </Switch.Group>
                <button
                  type="button"
                  className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  onClick={backToDefault}
                >
                  Back to Default
                </button>
              </div>
            </div>
          ) : (
            <></>
          )}
        </>
      )}

      <button
        type="button"
        className="w-full rounded bg-indigo-50 px-2 py-1 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
        onClick={saveTheme}
      >
        Save
      </button>
    </div>
  );
};

export default Settings;
