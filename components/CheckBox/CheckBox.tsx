import React from "react";
import { Checkbox, Collapse } from "antd";
import "antd/dist/antd.css";
import styles from "./checkbox.module.scss";
import { CaretRightOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

function CheckBox({ filters, handleFilters }) {
  const [Checked, setChecked] = React.useState<number[]>([]);
  const [AllChecked, setAllChecked] = React.useState<boolean[]>([]);
  
  React.useEffect(() => {
    const stored: number[] = JSON.parse(localStorage.getItem("checked")) ?? [];
    setChecked(stored);
    handleFilters(stored);
  }, []);

  let event: {
    map: any;
    id: number;
    name: string;
    groupId: number;
    semester: number;
  }[] = [];

  const menus = ["LEI", "MEI"];

  const lei = [
    "1ˢᵗ year - 1ˢᵗ semester",
    "1ˢᵗ year - 2ⁿᵈ semester",
    "2ⁿᵈ year - 1ˢᵗ semester",
    "2ⁿᵈ year - 2ⁿᵈ semester",
    "3ʳᵈ year - 1ˢᵗ semester",
    "3ʳᵈ year - 2ⁿᵈ semester",
  ];

  const mei = [
    "1ˢᵗ year - 1ˢᵗ semester",
    "1ˢᵗ year - 2ⁿᵈ semester",
    "2ⁿᵈ year",
  ];

  const courses = [lei, mei];

  const sync = [0, 6];

  event[0] = filters.filter((f) => f.groupId === 1 && f.semester === 1);
  event[1] = filters.filter((f) => f.groupId === 1 && f.semester === 2);
  event[2] = filters.filter((f) => f.groupId === 2 && f.semester === 1);
  event[3] = filters.filter((f) => f.groupId === 2 && f.semester === 2);
  event[4] = filters.filter((f) => f.groupId === 3 && f.semester === 1);
  event[5] = filters.filter((f) => f.groupId === 3 && f.semester === 2);

  event[6] = filters.filter((f) => f.groupId === 4 && f.semester === 1);
  event[7] = filters.filter((f) => f.groupId === 4 && f.semester === 2);
  event[8] = filters.filter((f) => f.groupId === 5);

  event[9] = filters.filter((f) => f.groupId === 0);

  const handleToggle = (value: number) => {
    const currentId = Checked.indexOf(value);
    const newCheck = [...Checked];

    if (currentId === -1) {
      newCheck.push(value);
    } else {
      newCheck.splice(currentId, 1);
    }
    setChecked(newCheck);
    localStorage.setItem("checked", JSON.stringify(newCheck));
    handleFilters(newCheck);
  };
  
  const handleToggleAll = (values, index) => {
    const newCheck = [...Checked];
    const newAllCheck = [...AllChecked];
    newAllCheck[index] = !newAllCheck[index];
    if (newAllCheck[index])
      for (const value of values) {
        if (!newCheck.includes(value.id)) {
          newCheck.push(value.id);
        }
        setChecked(newCheck);
        setAllChecked(newAllCheck);
        handleFilters(newCheck);
      }
    else
      for (const value of values) {
        if (newCheck.includes(value.id)) {
          newCheck.splice(newCheck.indexOf(value.id));
        }
        setChecked(newCheck);
        setAllChecked(newAllCheck);
        handleFilters(newCheck);
      }
  };

  function isChecked(id) {
    return !(Checked.indexOf(id) === -1);
  }

  return (
    <div className={styles.layer}>
      {menus.map((m, index) => (
        <Collapse
          className={styles.checkbox}
          bordered={false}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
          key={index}
        >
          <Panel header={m} key={index + 1}>
            {courses[index].map((b, index1) => (
              <Collapse
                style={{ background: "white" }}
                bordered={false}
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                key={index1}
              >
                <Panel header={b} key={index1 + 1}>
                  <React.Fragment key={-1}>
                    <div style={{ margin: "0 0 0.3rem 0" }}>
                      <Checkbox
                        type="Checkbox"
                        onClick={() =>
                          handleToggleAll(event[index1 + sync[index]], index1)
                        }
                      >
                        All
                      </Checkbox>
                    </div>
                  </React.Fragment>
                  <div style={{ fontWeight: 400 }}>
                    {event[index1 + sync[index]]?.map(
                      (
                        value: {
                          id: number;
                          name: string;
                          groupId: number;
                          semester: number;
                        },
                        index2: number
                      ) => (
                        <React.Fragment key={index2}>
                          <div>
                            <Checkbox
                              onChange={() => handleToggle(value.id)}
                              type="checkbox"
                              checked={
                                Checked.indexOf(value.id) === -1 ? false : true
                              }
                            >
                              {value.name}
                            </Checkbox>
                          </div>
                        </React.Fragment>
                      )
                    )}
                  </div>
                </Panel>
              </Collapse>
            ))}
          </Panel>
        </Collapse>
      ))}

      {/* Others */}

      <Collapse
        className={styles.checkbox}
        bordered={false}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
      >
        <Panel header="Others" key="">
          <div style={{ fontWeight: 400 }}>
            {event[9]?.map(
              (
                value: {
                  id: number;
                  name: string;
                  groupId: number;
                  semester: number;
                },
                index: number
              ) => (
                <React.Fragment key={index}>
                  <div>
                    <Checkbox
                      onChange={() => handleToggle(value.id)}
                      type="checkbox"
                      checked={Checked.indexOf(value.id) === -1 ? false : true}
                    >
                      {value.name}
                    </Checkbox>
                  </div>
                </React.Fragment>
              )
            )}
          </div>
        </Panel>
      </Collapse>
    </div>
  );
}

export default CheckBox;
