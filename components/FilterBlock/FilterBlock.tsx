import { Checkbox, Collapse } from "antd";
import "antd/dist/reset.css";

import { Fragment } from "react";

import styles from "./filterblock.module.scss";

type FilterBlockProps = {
  layer1: string[];
  layer2?: string[];
  checkBoxes: CheckBoxProps[][];
};

type CheckBoxProps = {
  id: number;
  label: string;
  shifts?: string[];
};

const FilterBlock = ({ layer1, layer2, checkBoxes }: FilterBlockProps) => {
  const SelectAll = ({
    index1,
    index2,
  }: {
    index1: number;
    index2: number;
  }) => {
    const index = index1 * 2 + index2;

    return (
      <>
        {checkBoxes[index] && checkBoxes[index].length > 1 && (
          <Fragment key={index + "Fragment"}>
            <div className="mb-1.5 border-b pb-1.5">
              <Checkbox>Select All</Checkbox>
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
    const index = index1 * 2 + index2;

    return (
      <>
        {checkBoxes[index] && checkBoxes[index].length > 0 && (
          <div className="font-normal">
            {checkBoxes[index] &&
              checkBoxes[index].length > 0 &&
              checkBoxes[index].map((item3) => (
                <Fragment key={item3.id + "Fragment"}>
                  <div>
                    <Checkbox key={item3.id + "CheckBox"}>
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

  return (
    <div className={styles.layer}>
      <Collapse className={styles.checkbox} bordered={false} accordion>
        {layer1 &&
          layer1.map((item1, index1) => (
            <Collapse.Panel header={item1} key={item1}>
              <Collapse className="bg-white" bordered={false} accordion>
                {layer2 ? (
                  layer2.map((item2, index2) => (
                    <Collapse.Panel header={item2} key={item2}>
                      <Collapse
                        className="bg-white font-normal"
                        bordered={false}
                        accordion
                      >
                        {checkBoxes[index1 * 2 + index2] &&
                        checkBoxes[index1 * 2 + index2].some(
                          (item) => item.shifts
                        ) ? (
                          <>
                            {checkBoxes[index1 * 2 + index2].map((item3) => (
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
                  ))
                ) : (
                  <CheckBoxList index1={0} index2={index1} />
                )}
              </Collapse>
            </Collapse.Panel>
          ))}
      </Collapse>
    </div>
  );
};

export default FilterBlock;
