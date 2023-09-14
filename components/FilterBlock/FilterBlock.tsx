import { Checkbox, Collapse } from "antd";
import "antd/dist/reset.css";

import { Fragment, useState, useEffect } from "react";

import { CheckBoxProps } from "../../types";

type FilterBlockProps = {
  layer1: string[];
  layer2?: string[];
  checkBoxes: CheckBoxProps[][];
  exception?: number;
  checked: number[];
  setChecked: (values: number[]) => void;
  handleFilters: any;
};

type SelectedShift = {
  id: number;
  shifts: string[];
};

const FilterBlock = ({
  layer1,
  layer2,
  checkBoxes,
  exception,
  checked,
  setChecked,
  handleFilters,
}: FilterBlockProps) => {
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
          <Fragment key={index + "Fragment"}>
            <div className="mb-1.5 border-b pb-1.5 font-display font-medium">
              <Checkbox
                onChange={() => handleToggleAll(index)}
                checked={isAllChecked(index)}
                indeterminate={isSomeChecked(index) && !isAllChecked(index)}
              >
                Select All
              </Checkbox>
            </div>
          </Fragment>
        )}
      </>
    );
  };

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
              checkBoxes[index].map((item3) => (
                <Fragment key={item3.id + "Fragment"}>
                  <div>
                    <Checkbox
                      key={item3.id + "CheckBox"}
                      onChange={() => handleToggle(item3.id)}
                      checked={isChecked(item3.id)}
                    >
                      {item3.label}
                    </Checkbox>
                  </div>
                </Fragment>
              ))}
          </div>
        )}
      </>
    );
  };

  const ShiftCheckBoxList = ({ shifts }: { shifts: string[] }) => {
    return (
      <>
        {shifts &&
          shifts.length > 0 &&
          shifts.map((item) => (
            <Fragment key={item + "Fragment"}>
              <div>
                <Checkbox key={item + "CheckBox"}>{item}</Checkbox>
              </div>
            </Fragment>
          ))}
      </>
    );
  };

  function handleToggle(id: number) {
    const currentIdIndex = checked.indexOf(id);
    const newCheck = [...checked];

    if (currentIdIndex === -1) newCheck.push(id);
    else newCheck.splice(currentIdIndex, 1);

    setChecked(newCheck);
    handleFilters(newCheck);
    localStorage.setItem("checked", JSON.stringify(newCheck));
  }

  function handleToggleAll(index: number) {
    let newChecked = [...checked];

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

  const isChecked = (id: number): boolean => {
    return checked.includes(id);
  };

  const isAllChecked = (index: number): boolean => {
    return (
      checkBoxes[index] &&
      checkBoxes[index].every((c) => checked.includes(c.id))
    );
  };

  const isSomeChecked = (index: number): boolean => {
    return (
      checkBoxes[index] && checkBoxes[index].some((c) => checked.includes(c.id))
    );
  };

  const CheckedIndicator = () => {
    return (
      <div className="absolute right-20 mt-5 inline-flex h-fit w-fit overflow-hidden">
        <div className="ml-1 rounded-full bg-blue-200 p-1" />
      </div>
    );
  };

  const Layer1CheckedIndicator = ({ index }: { index: number }) => {
    const indexs: number[] = Array.from(
      { length: layer2 ? layer2.length : 1 },
      (v, i) => i
    );

    const isOn: boolean = indexs.some((i) =>
      isSomeChecked(index * (layer2 ? layer2.length : 1) + i)
    );

    return isOn && <CheckedIndicator />;
  };

  const Layer2CheckedIndicator = ({
    index1,
    index2,
  }: {
    index1: number;
    index2: number;
  }) => {
    const isOn: boolean = isSomeChecked(index1 * layer2.length + index2);

    return isOn && <CheckedIndicator />;
  };

  return (
    <div className="select-none">
      <Collapse
        className="w-full rounded-2xl bg-white font-display font-medium shadow-default"
        bordered={false}
        accordion
      >
        {layer1 &&
          layer1.map((item1, index1) => (
            <>
              <Layer1CheckedIndicator index={index1} />
              <Collapse.Panel header={item1} key={item1}>
                <Collapse
                  className="bg-white font-display font-medium"
                  bordered={false}
                  accordion
                >
                  {layer2 && index1 !== exception ? (
                    layer2.map((item2, index2) => (
                      <>
                        <Layer2CheckedIndicator
                          index1={index1}
                          index2={index2}
                        />
                        <Collapse.Panel header={item2} key={item2}>
                          <Collapse
                            className="bg-white font-normal"
                            bordered={false}
                            accordion
                          >
                            {checkBoxes[index1 * layer2.length + index2] &&
                            checkBoxes[index1 * layer2.length + index2].some(
                              (item) => item.shifts
                            ) ? (
                              <>
                                {checkBoxes[
                                  index1 * (layer2 ? layer2.length : 1) + index2
                                ].map((item3) => (
                                  <Collapse.Panel
                                    header={item3.label}
                                    key={item3.id}
                                  >
                                    <ShiftCheckBoxList shifts={item3.shifts} />
                                  </Collapse.Panel>
                                ))}
                              </>
                            ) : (
                              <>
                                <SelectAll index1={index1} index2={index2} />
                                <CheckBoxList index1={index1} index2={index2} />
                              </>
                            )}
                          </Collapse>
                        </Collapse.Panel>
                      </>
                    ))
                  ) : index1 === exception ? (
                    <>
                      <SelectAll index1={index1} index2={0} />
                      <CheckBoxList index1={index1} index2={0} />
                    </>
                  ) : (
                    <>
                      <SelectAll index1={0} index2={index1} />
                      <CheckBoxList index1={0} index2={index1} />
                    </>
                  )}
                </Collapse>
              </Collapse.Panel>
            </>
          ))}
      </Collapse>
    </div>
  );
};

export default FilterBlock;
