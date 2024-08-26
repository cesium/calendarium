import { Checkbox, Collapse } from "antd";
import "antd/dist/reset.css";

import { Fragment } from "react";

import { CheckBoxProps, SelectedShift } from "../../types";

type FilterBlockProps = {
  layer1: string[]; // contains the titles for the collapses of the 1st layer
  layer2?: string[]; // contains the titles for the collapses of the 2nd layer
  checkBoxes: CheckBoxProps[][]; // contains the checkboxes information in a universal format
  exception?: number; // indicates the index of an element from layer1 where the layer2 should be ignored, for example "5th year"
  checked: number[] | SelectedShift[]; // assumes different types when called from ScheduleFilters.tsx and EventFilters.tsx
  setChecked: (obj: number[] | SelectedShift[]) => void; // assumes different types when called from ScheduleFilters.tsx and EventFilters.tsx
  handleFilters: any; // assumes different types when called from ScheduleFilters.tsx and EventFilters.tsx
  isShifts: boolean; // used to know if FilterBlock is being called from ScheduleFilters.tsx or EventFilters.tsx
};

const FilterBlock = ({
  layer1,
  layer2,
  checkBoxes,
  exception,
  checked,
  setChecked,
  handleFilters,
  isShifts,
}: FilterBlockProps) => {
  // "Select All" checkbox
  const SelectAll = ({
    index1,
    index2,
  }: {
    index1: number;
    index2: number;
  }) => {
    const index = index1 * (layer2 ? layer2.length : 1) + index2;

    return (
      <>
        {checkBoxes[index] && checkBoxes[index].length > 1 && (
          <Fragment key={index + "SelectAllCheckbox"}>
            <div className="mb-1.5 border-b pb-1.5 font-display font-medium">
              <Checkbox
                onChange={() => handleToggleAll(index)}
                checked={isAllChecked(index)}
                indeterminate={
                  isSomeLayer1Checked(index) && !isAllChecked(index)
                }
              >
                Select All
              </Checkbox>
            </div>
          </Fragment>
        )}
      </>
    );
  };

  // GENERAL

  // Creates a list of checkboxes for a specific group
  const CheckBoxList = ({
    index1,
    index2,
  }: {
    index1: number;
    index2: number;
  }) => {
    const index = index1 * (layer2 ? layer2.length : 1) + index2;

    return (
      <>
        {checkBoxes[index] && checkBoxes[index].length > 0 && (
          <div className="font-display font-normal">
            {checkBoxes[index] &&
              checkBoxes[index].length > 0 &&
              checkBoxes[index].map((item) => (
                <Fragment key={item.id + "Checkbox"}>
                  <div>
                    <Checkbox
                      key={item.id + "CheckBox"}
                      onChange={() => handleToggle(item.id)}
                      checked={isChecked(item.id)}
                    >
                      {item.label}
                    </Checkbox>
                  </div>
                </Fragment>
              ))}
          </div>
        )}
      </>
    );
  };

  // Handles the toggle of a checkbox
  function handleToggle(id: number) {
    const currentIdIndex = (checked as number[]).indexOf(id);
    const newCheck: number[] = [...checked] as number[];

    if (currentIdIndex === -1) newCheck.push(id);
    else newCheck.splice(currentIdIndex, 1);

    setChecked(newCheck);
    handleFilters(newCheck);
    localStorage.setItem("checked", JSON.stringify(newCheck));
  }

  // Handles the toggle of the "Select All" checkbox
  function handleToggleAll(index: number) {
    let newChecked: number[] = [...checked] as number[];

    if (!isAllChecked(index))
      checkBoxes[index].map((event) => newChecked.push(event.id));
    else {
      newChecked = newChecked.filter(
        (id) => !checkBoxes[index].find((value) => value.id === id)
      );
    }

    setChecked(newChecked);
    handleFilters(newChecked);
    localStorage.setItem("checked", JSON.stringify(newChecked));
  }

  // Checks if a certain checkbox is selected (checked)
  const isChecked = (id: number): boolean => {
    return (checked as number[]).includes(id);
  };

  // Checks if all the checkboxes under a specific group are selected (checked)
  const isAllChecked = (index: number): boolean => {
    return (
      checkBoxes[index] &&
      checkBoxes[index].every((c) => (checked as number[]).includes(c.id))
    );
  };

  // Checks if some checkbox that falls under the 2nd layer is selected (checked)
  const isSomeLayer2Checked = (index: number): boolean => {
    return (
      checkBoxes[index] &&
      checkBoxes[index].some((c) => (checked as number[]).includes(c.id))
    );
  };

  // Checks if some checkbox that falls under the 1st layer is selected (checked)
  const isSomeLayer1Checked = (index: number): boolean => {
    const indexs: number[] = Array.from(
      { length: layer2 ? layer2.length : 1 },
      (v, i) => i
    );

    return indexs.some((i) =>
      isSomeLayer2Checked(index * (layer2 ? layer2.length : 1) + i)
    );
  };

  // Tiny blue ball, used to indicate that something inside a Collpase is selected
  const CheckedIndicator = () => {
    return (
      <div className="absolute right-20 mt-5 inline-flex h-fit w-fit overflow-hidden">
        <div className="ml-1 rounded-full bg-blue-200 p-1" />
      </div>
    );
  };

  // Indicates if some checkbox that falls under the 1st layer is selected
  const Layer1CheckedIndicator = ({ index }: { index: number }) => {
    const isOn: boolean = isShifts
      ? isSomeLayer1ShiftChecked(index)
      : isSomeLayer1Checked(index);

    return isOn && <CheckedIndicator />;
  };

  // Indicates if some checkbox that falls under the 2nd layer is selected
  const Layer2CheckedIndicator = ({
    index1,
    index2,
  }: {
    index1: number;
    index2: number;
  }) => {
    const index = index1 * layer2.length + index2;
    const isOn: boolean = isShifts
      ? isSomeLayer2ShiftChecked(index)
      : isSomeLayer2Checked(index);

    return isOn && <CheckedIndicator />;
  };

  // USED FOR SCHEDULE

  // Creates a list of checkboxes for a specific subject (only used for Schedule)
  const ShiftCheckBoxList = ({
    id,
    shifts,
  }: {
    id: number;
    shifts: string[];
  }) => {
    return (
      <>
        {shifts && shifts.length > 0 ? (
          shifts.map((item) => (
            <Fragment key={id.toString() + item + "Checkbox"}>
              <div>
                <Checkbox
                  key={item + "CheckBox"}
                  onChange={() => handleShiftToggle(id, item)}
                  checked={isShiftChecked(id, item)}
                >
                  {item}
                </Checkbox>
              </div>
            </Fragment>
          ))
        ) : (
          <p className="text-neutral-400">Information not available.</p>
        )}
      </>
    );
  };

  // Handles the toggle of a checkbox containing a shift (only used for Schedule)
  function handleShiftToggle(id: number, shift: string) {
    const currentIdIndex = (checked as SelectedShift[]).findIndex(
      (selectedShift: SelectedShift) =>
        selectedShift.id === id && selectedShift.shift === shift
    );
    const newChecked: SelectedShift[] = [...checked] as SelectedShift[];

    const shiftObj: SelectedShift = { id: id, shift: shift };
    if (currentIdIndex === -1) newChecked.push(shiftObj);
    else newChecked.splice(currentIdIndex, 1);

    setChecked(newChecked);
    handleFilters(newChecked);
    localStorage.setItem("shifts", JSON.stringify(newChecked));
  }

  // Checks if a specific shift is selected (checked) (only used for Schedule)
  const isShiftChecked = (id: number, shift: string): boolean => {
    return (checked as SelectedShift[]).some((shiftObj) => {
      return id === shiftObj.id && shift === shiftObj.shift;
    });
  };

  // Checks if some shift under a certain subject is selected (checked) (only used for Schedule)
  const isSomeSubjectShiftChecked = (id: number): boolean => {
    return (checked as SelectedShift[]).some((s) => s.id === id);
  };

  // Checks if a shift that falls under a Collapse from the 2nd layer is selected (checked) (only used for Schedule)
  const isSomeLayer2ShiftChecked = (index: number): boolean => {
    return (
      checkBoxes[index] &&
      checkBoxes[index].some((c) => isSomeSubjectShiftChecked(c.id))
    );
  };

  // Checks if a shift that falls under a Collapse from the 1st layer is selected (checked) (only used for Schedule)
  const isSomeLayer1ShiftChecked = (index: number): boolean => {
    const indexs: number[] = Array.from(
      { length: layer2 ? layer2.length : 1 },
      (v, i) => i
    );

    return indexs.some((i) =>
      isSomeLayer2ShiftChecked(index * (layer2 ? layer2.length : 1) + i)
    );
  };

  // Indicates if some shift from a specific subject is selected (only used for Schedule)
  const Layer3CheckedIndicator = ({ id }: { id: number }) => {
    return isSomeSubjectShiftChecked(id) && <CheckedIndicator />;
  };

  return (
    <div className="select-none rounded-xl ring-1 ring-neutral-100/50 dark:ring-neutral-400/20">
      <Collapse
        className="w-full rounded-xl bg-white font-display font-medium shadow-default dark:bg-neutral-800/70"
        bordered={false}
        accordion
      >
        {layer1 &&
          layer1.map((item1, index1) => (
            <Fragment key={item1 + "Fragment1"}>
              <Layer1CheckedIndicator
                index={index1}
                key={item1 + "Layer1CheckedIndicator"}
              />
              <Collapse.Panel header={item1} key={item1 + "Panel"}>
                <Collapse
                  className="bg-white font-display font-medium dark:bg-inherit"
                  bordered={false}
                  accordion
                  key={item1 + "Collapse"}
                >
                  {layer2 && index1 !== exception ? (
                    layer2.map((item2, index2) => (
                      <Fragment key={item2 + "Fragment2"}>
                        <Layer2CheckedIndicator
                          index1={index1}
                          index2={index2}
                          key={item1 + item2 + "Layer2CheckedIndicator"}
                        />
                        <Collapse.Panel
                          header={item2}
                          key={item1 + item2 + "Panel"}
                        >
                          <Collapse
                            className="bg-white font-display font-normal dark:bg-inherit"
                            bordered={false}
                            accordion
                            key={item1 + item2 + "Collapse"}
                          >
                            {checkBoxes[index1 * layer2.length + index2] &&
                            checkBoxes[index1 * layer2.length + index2].some(
                              (item) => item.shifts && item.shifts.length > 0
                            ) ? (
                              <>
                                {checkBoxes[
                                  index1 * (layer2 ? layer2.length : 1) + index2
                                ].map((item3) => (
                                  <Fragment key={item3 + "Fragment3"}>
                                    <Layer3CheckedIndicator
                                      id={item3.id}
                                      key={item3.id + "Layer3CheckedIndicator"}
                                    />
                                    <Collapse.Panel
                                      header={item3.label}
                                      key={item3.id + "Panel"}
                                    >
                                      <ShiftCheckBoxList
                                        id={item3.id}
                                        shifts={item3.shifts}
                                        key={item3.id + "ShiftCheckBoxList"}
                                      />
                                    </Collapse.Panel>
                                  </Fragment>
                                ))}
                              </>
                            ) : checkBoxes[
                                index1 * layer2.length + index2
                              ].some((item) => item.shifts) ? (
                              <p className="text-neutral-400">
                                Information not available.
                              </p>
                            ) : (
                              <>
                                <SelectAll
                                  index1={index1}
                                  index2={index2}
                                  key={item2 + "SelectAll"}
                                />
                                <CheckBoxList
                                  index1={index1}
                                  index2={index2}
                                  key={item2 + "CheckBoxList"}
                                />
                              </>
                            )}
                          </Collapse>
                        </Collapse.Panel>
                      </Fragment>
                    ))
                  ) : index1 === exception ? (
                    <>
                      <SelectAll
                        index1={index1}
                        index2={0}
                        key={item1 + "SelectAll"}
                      />
                      <CheckBoxList
                        index1={index1}
                        index2={0}
                        key={item1 + "CheckBoxList"}
                      />
                    </>
                  ) : (
                    <>
                      <SelectAll
                        index1={0}
                        index2={index1}
                        key={item1 + "SelectAll"}
                      />
                      <CheckBoxList
                        index1={0}
                        index2={index1}
                        key={item1 + "CheckBoxList"}
                      />
                    </>
                  )}
                </Collapse>
              </Collapse.Panel>
            </Fragment>
          ))}
      </Collapse>
    </div>
  );
};

export default FilterBlock;
