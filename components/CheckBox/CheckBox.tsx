import React from "react";
import { Checkbox, Collapse } from "antd";
import "antd/dist/antd.css";

const { Panel } = Collapse;

function CheckBox({ filters, handleFilters }) {
  const [Checked, setChecked] = React.useState<number[]>([]);
  React.useEffect(() => {
    const stored: number[] = JSON.parse(localStorage.getItem("checked")) ?? []
    setChecked(stored)
    handleFilters(stored)
  }, [])

  let event: {
    map: any;
    id: number;
    name: string;
    groupId: number;
    semester: number;
  }[] = [];
  const semesters = [
    "[LEI] 1st Year - 1st Semester",
    "[LEI] 1st Year - 2nd Semester",
    "[LEI] 2nd Year - 1st Semester",
    "[LEI] 2nd Year - 2nd Semester",
    "[LEI] 3rd Year - 1st Semester",
    "[LEI] 3rd Year - 2nd Semester",
    "[MEI] 1st Year - 1st Semester",
    "[MEI] 1st Year - 2nd Semester",
    "[MEI] 2nd Year",
    "Others",
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
    localStorage.setItem("checked", JSON.stringify(newCheck))
    handleFilters(newCheck);
  };

  function isChecked(id) {
    return !(Checked.indexOf(id) === -1)
  }
  return (
    <Collapse>
      <Panel header="Filters" key={0}>
        <Collapse>
          {semesters.map((b, index1) => (
            <Panel header={b} key={index1}>
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
                        onChange={_ => handleToggle(value.id)}
                        type="checkbox"
                        checked={isChecked(value.id)}
                      />
                      <span className="pl-2">{value.name}</span>
                    </div>
                  </React.Fragment>
                )
              )}
            </Panel>
          ))}
        </Collapse>
      </Panel>
    </Collapse>
  );
}

export default CheckBox;
