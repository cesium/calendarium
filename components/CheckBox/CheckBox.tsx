import React from "react";
import { Checkbox, Collapse } from "antd";
import "antd/dist/antd.css";
import styles from "./checkbox.module.scss";
import { CaretRightOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

function CheckBox({ filters, handleFilters }) {
  const [Checked, setChecked] = React.useState<number[]>([]);

  let event: {
    map: any;
    id: number;
    name: string;
    groupId: number;
    semester: number;
  }[] = [];

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
    handleFilters(newCheck);
  };

  return (
    <div className={styles.layer}>
      {/* LEI */}

      <Collapse
        className={styles.checkbox}
        bordered={false}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
      >
        <Panel header="LEI" key={0}>
          {lei.map((b, index1) => (
            <Collapse
              style={{ background: "white" }}
              bordered={false}
              expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0} />
              )}
              key={index1}
            >
              <Panel header={b} key={index1 + 1}>
                <div style={{ fontWeight: 400 }}>
                  {/* <div>
                    <Checkbox type="checkbox" onChange={}>
                      {" "}
                      Check all
                    </Checkbox>
                  </div> */}
                  {event[index1]?.map(
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

      {/* MEI */}

      <Collapse
        className={styles.checkbox}
        bordered={false}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
      >
        <Panel header="MEI" key={0}>
          {mei.map((b, index1) => (
            <Collapse
              style={{ background: "white" }}
              bordered={false}
              expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0} />
              )}
              key={index1}
            >
              <Panel header={b} key={index1 + 1}>
                <div style={{ fontWeight: 400 }}>
                  {/* <div>
                    <Checkbox type="checkbox" onChange={}>
                      {" "}
                      Check all
                    </Checkbox>
                  </div> */}
                  {event[index1 + 6]?.map(
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
            {/* <div>
              <Checkbox type="checkbox" onChange={}>
                {" "}
                Check all
              </Checkbox>
            </div> */}
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
