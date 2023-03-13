import React from "react";
import { Checkbox, Collapse } from "antd";
import "antd/dist/reset.css";
import styles from "./checkbox.module.scss";
import { CaretRightOutlined } from "@ant-design/icons";
import { NULL } from "sass";

const { Panel } = Collapse;

function CheckBox({ filters, handleFilters }) {
  const [Checked, setChecked] = React.useState<number[]>([]);

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
  }[][] = [];

  const menus = ["LEI", "MEI"];

  const mei = ["1ˢᵗ year", "2ⁿᵈ year"];

  const lei = ["1ˢᵗ year", "2ⁿᵈ year", "3ʳᵈ year"];

  const semesters = ["1ˢᵗ semester", "2ⁿᵈ semester"];

  const sync = [0, 6];

  const event_index = (index: number, index1: number, index2) => {
    return sync[index] + index1 * 2 + index2;
  };

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

  const isAllChecked = (index: number) => {
    return !event[index].some((elem) => {
      return !Checked.includes(elem.id);
    });
  };

  const isNoneChecked = (index: number) => {
    return !event[index].some((elem) => {
      return Checked.includes(elem.id);
    });
  };

  const handleToggleAll = (values, index: number) => {
    let newChecked = [...Checked];

    if (!isAllChecked(index)) {
      values.map((event) => newChecked.push(event.id));
    } else {
      newChecked = newChecked.filter(
        (eventId) => !values.find((value) => value.id === eventId)
      );
    }

    setChecked(newChecked);
    handleFilters(newChecked);
    localStorage.setItem("checked", JSON.stringify(newChecked));
  };

  return (
    <div className={styles.layer}>
      <Collapse
        className={styles.checkbox}
        bordered={false}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
      >
        <Panel header={menus[0]} key="panel">
          <div className={styles.items}>
            {lei.map((b, index1) => (
              <Collapse
                className={styles.sub_checkbox}
                bordered={false}
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                key={index1}
              >
                <Panel header={b} key={index1 + 1}>
                  {semesters.map((s, index2) => (
                    <Collapse
                      className={styles.sub_checkbox}
                      bordered={false}
                      expandIcon={({ isActive }) => (
                        <CaretRightOutlined rotate={isActive ? 90 : 0} />
                      )}
                      key={index2}
                    >
                      <Panel header={s} key={index2 + 1}>
                        <React.Fragment key={-1}>
                          <div
                            style={{
                              padding: "0 0 5px 0",
                              margin: "0 0 5px 0",
                              borderBottom: "solid rgba(200,200,200,.5) 1px",
                            }}
                          >
                            <Checkbox
                              type="Checkbox"
                              onClick={() =>
                                handleToggleAll(
                                  event[event_index(0, index1, index2)],
                                  event_index(0, index1, index2)
                                )
                              }
                              checked={isAllChecked(
                                event_index(0, index1, index2)
                              )}
                              indeterminate={
                                !isAllChecked(event_index(0, index1, index2)) &&
                                !isNoneChecked(event_index(0, index1, index2))
                              }
                            >
                              Select All
                            </Checkbox>
                          </div>
                        </React.Fragment>
                        <div style={{ fontWeight: 400 }}>
                          {event[event_index(0, index1, index2)]?.map(
                            (
                              value: {
                                id: number;
                                name: string;
                                groupId: number;
                                semester: number;
                              },
                              index3: number
                            ) => (
                              <React.Fragment key={index3}>
                                <div>
                                  <Checkbox
                                    onChange={() => handleToggle(value.id)}
                                    type="checkbox"
                                    checked={
                                      Checked.indexOf(value.id) === -1
                                        ? false
                                        : true
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
          </div>
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
        <Panel header={menus[1]} key="panel">
          <div className={styles.items}>
            {/* 1º ano */}

            <Collapse
              className={styles.sub_checkbox}
              bordered={false}
              expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0} />
              )}
            >
              <Panel header={mei[0]} key="panel">
                {semesters.map((s, index2) => (
                  <Collapse
                    className={styles.sub_checkbox}
                    bordered={false}
                    expandIcon={({ isActive }) => (
                      <CaretRightOutlined rotate={isActive ? 90 : 0} />
                    )}
                    key={index2}
                  >
                    <Panel header={s} key={index2 + 1}>
                      <React.Fragment key={-1}>
                        <div
                          style={{
                            padding: "0 0 5px 0",
                            margin: "0 0 5px 0",
                            borderBottom: "solid rgba(200,200,200,.5) 1px",
                          }}
                        >
                          <Checkbox
                            type="Checkbox"
                            onClick={() =>
                              handleToggleAll(
                                event[event_index(1, 0, index2)],
                                event_index(1, 0, index2)
                              )
                            }
                            checked={isAllChecked(event_index(1, 0, index2))}
                            indeterminate={
                              !isAllChecked(event_index(1, 0, index2)) &&
                              !isNoneChecked(event_index(1, 0, index2))
                            }
                          >
                            Select All
                          </Checkbox>
                        </div>
                      </React.Fragment>
                      <div style={{ fontWeight: 400 }}>
                        {event[event_index(1, 0, index2)]?.map(
                          (
                            value: {
                              id: number;
                              name: string;
                              groupId: number;
                              semester: number;
                            },
                            index3: number
                          ) => (
                            <React.Fragment key={index3}>
                              <div>
                                <Checkbox
                                  onChange={() => handleToggle(value.id)}
                                  type="checkbox"
                                  checked={
                                    Checked.indexOf(value.id) === -1
                                      ? false
                                      : true
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

            {/* 2º ano */}

            <Collapse
              className={styles.sub_checkbox}
              bordered={false}
              expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0} />
              )}
            >
              <Panel header={mei[1]} key="panel">
                <div style={{ fontWeight: 400 }}>
                  {event[8]?.map(
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
          </div>
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
