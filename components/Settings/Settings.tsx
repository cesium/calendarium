import { useEffect, useState, useMemo } from "react";

import { Switch } from "@headlessui/react";

import { HexColorPicker } from "react-colorful";

import { reduceOpacity, defaultColors } from "../../utils/utils";

export type SubjectColor = {
  filterId: number;
  color: string;
};

const Settings = ({ saveTheme, filters }) => {
  const [theme, setTheme] = useState<string>("Modern");
  const [colors, setColors] = useState<string[]>(defaultColors);
  const [opacity, setOpacity] = useState<boolean>(true);
  const [openColor, setOpenColor] = useState<number>(1);
  const [customType, setCustomType] = useState<string>("Year");
  const [checkedFilters, setCheckedFilters] = useState<number[]>([]);
  const [subjectColors, setSubjectColors] = useState<SubjectColor[]>([]);

  function initializeSubjectColors() {
    const newSubjectColors: SubjectColor[] = [];
    filters.forEach((f) => {
      newSubjectColors.push({
        filterId: f.id,
        color: defaultColors[f.groupId],
      });
    });
    setSubjectColors(newSubjectColors);
    localStorage.setItem("subjectColors", JSON.stringify(newSubjectColors));
  }

  function getSubjectColor(index: number) {
    return subjectColors.find((sc) => sc.filterId === checkedFilters[index])
      .color;
  }

  function getBgSubjectColor(index: number) {
    if (opacity)
      return reduceOpacity(
        subjectColors.find((sc) => sc.filterId === checkedFilters[index]).color
      );
    else
      return subjectColors.find((sc) => sc.filterId === checkedFilters[index])
        .color;
  }

  function getTextSubjectColor(index: number) {
    if (opacity)
      return subjectColors.find((sc) => sc.filterId === checkedFilters[index])
        .color;
    else return "white";
  }

  function updateSubjectColors(newColor: string) {
    const newSubjectColors = [...subjectColors];
    newSubjectColors.find(
      (sc) => sc.filterId === checkedFilters[openColor]
    ).color = newColor;
    setSubjectColors(newSubjectColors);
    localStorage.setItem("subjectColors", JSON.stringify(newSubjectColors));
  }

  function getBgColor(index: number) {
    if (opacity) return reduceOpacity(colors[index]);
    else return colors[index];
  }

  function getTextColor(index: number) {
    if (opacity) return colors[index];
    else return "white";
  }

  function updateColors(newColor: string) {
    const newColors = [...colors];
    newColors[openColor] = newColor;
    setColors(newColors);
    localStorage.setItem("colors", newColors.join(","));
  }

  function updateTheme(newTheme: string) {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    saveTheme();
  }

  function updateOpacity(updateOpacity: boolean) {
    setOpacity(updateOpacity);
    localStorage.setItem("opacity", updateOpacity.toString());
  }

  function updateCustomType(newCustomType: string) {
    setCustomType(newCustomType);
    localStorage.setItem("customType", newCustomType);
    saveTheme();
  }

  function backToSubjectDefault() {
    initializeSubjectColors();
    setOpacity(true);
    localStorage.setItem("opacity", "true");
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
    const opacity = localStorage.getItem("opacity") === "true";
    const customType = localStorage.getItem("customType");
    const checkedFilters: number[] = JSON.parse(
      localStorage.getItem("checked")
    );
    const subjectColors: SubjectColor[] = JSON.parse(
      localStorage.getItem("subjectColors")
    );

    if (theme) setTheme(theme);

    if (colors) setColors(colors.split(","));

    if (opacity) setOpacity(opacity);

    if (customType) setCustomType(customType);

    if (checkedFilters) setCheckedFilters(checkedFilters);

    if (subjectColors && subjectColors.length > 0)
      setSubjectColors(subjectColors);
    else initializeSubjectColors();
  }

  useEffect(() => {
    getSettings();
  }, []);

  return (
    <div className="h-full w-full space-y-4 overflow-hidden rounded-2xl p-4 shadow-default">
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
          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-cesium-900"
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
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-cesium-900"
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
                      className="flex h-9 w-full place-content-center items-center rounded-xl font-medium"
                      style={{
                        backgroundColor: getBgColor(index + 1),
                        color: getTextColor(index + 1),
                      }}
                      onClick={() => setOpenColor(index + 1)}
                    >
                      {index + 1}º
                    </button>
                  ))}
                </div>
                <div>
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
                      opacity ? "bg-cesium-900" : "bg-gray-200"
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
                  className="rounded-md border bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
                  onClick={backToDefault}
                >
                  Back to Default
                </button>
              </div>
            </div>
          ) : checkedFilters.length > 0 ? (
            <div id="bySubject" className="space-y-4">
              <div className="flex flex-col place-content-between items-center space-y-2">
                <div className="grid h-full w-full grid-flow-row grid-cols-3 gap-1">
                  {checkedFilters.map((filterId, index) => (
                    <button
                      key={index}
                      className="h-7 w-full place-content-center items-center rounded-xl text-sm font-medium"
                      style={{
                        backgroundColor: getBgSubjectColor(index),
                        color: getTextSubjectColor(index),
                      }}
                      onClick={() => setOpenColor(index)}
                    >
                      {filters
                        .filter((f) => f.id === filterId)
                        .map((f) => f.name)}
                    </button>
                  ))}
                </div>
                <div>
                  <HexColorPicker
                    color={getSubjectColor(openColor)}
                    onChange={(newColor) => updateSubjectColors(newColor)}
                  />
                </div>
              </div>
              <div className="flex flex-row place-content-between">
                <Switch.Group as="div" className="flex items-center">
                  <Switch
                    checked={opacity}
                    onChange={updateOpacity}
                    className={`${
                      opacity ? "bg-cesium-900" : "bg-gray-200"
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
                  className="rounded-md border bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
                  onClick={backToSubjectDefault}
                >
                  Back to Default
                </button>
              </div>
            </div>
          ) : (
            <div className="text-gray-900">
              <i className="bi bi-exclamation-circle-fill text-warning" />{" "}
              Select at least one subject.
            </div>
          )}
          <button
            type="button"
            className="w-full rounded-md bg-cesium-100 px-2 py-1 text-sm font-semibold text-cesium-900 shadow-sm hover:bg-cesium-200"
            onClick={saveTheme}
          >
            Save
          </button>
        </>
      )}
    </div>
  );
};

export default Settings;
