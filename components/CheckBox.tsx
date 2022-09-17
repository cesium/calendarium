import React from "react";
import { Checkbox, Collapse } from "antd";
import "antd/dist/antd.css";

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
  const semesters = [
    "[LEI] 1º Ano - 1º Semestre",
    "[LEI] 1º Ano - 2º Semestre",
    "[LEI] 2º Ano - 1º Semestre",
    "[LEI] 2º Ano - 2º Semestre",
    "[LEI] 3º Ano - 1º Semestre",
    "[LEI] 3º Ano - 2º Semestre",
    "[MEI] 1º Ano - 1º Semestre",
    "[MEI] 1º Ano - 2º Semestre",
    "[MEI] 2º Ano",
    "Outro",
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
    <Collapse>
      <Panel header="Filtros" key={0}>
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
                        onChange={() => handleToggle(value.id)}
                        type="checkbox"
                        checked={
                          Checked.indexOf(value.id) === -1 ? false : true
                        }
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
