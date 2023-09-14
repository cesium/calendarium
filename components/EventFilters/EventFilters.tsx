import { useEffect, useState, Fragment } from "react";
import { Checkbox, Collapse } from "antd";
import "antd/dist/reset.css";
import styles from "./eventfilters.module.scss";

const { Panel } = Collapse;

import FilterBlock from "../FilterBlock";
import { CheckBoxProps } from "../../types";

function EventFilters({ filters, handleFilters }) {
  const [checked, setChecked] = useState<number[]>([]);

  useEffect(() => {
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

  const mei = ["4ᵗʰ year", "5ᵗʰ year"];

  const lei = ["1ˢᵗ year", "2ⁿᵈ year", "3ʳᵈ year"];

  const semesters = ["1ˢᵗ semester", "2ⁿᵈ semester"];

  const sync = [0, 6];

  const event_index = (index: number, index1: number, index2: number) => {
    return sync[index] + index1 * 2 + index2;
  };

  event[0] = filters.filter((f) => f.groupId === 1 && f.semester === 1); // 1st year 1st semester
  event[1] = filters.filter((f) => f.groupId === 1 && f.semester === 2); // 1st year 2nd semester
  event[2] = filters.filter((f) => f.groupId === 2 && f.semester === 1); // 2nd year 1st semester
  event[3] = filters.filter((f) => f.groupId === 2 && f.semester === 2); // 2nd year 2nd semester
  event[4] = filters.filter((f) => f.groupId === 3 && f.semester === 1); // 3rd year 1st semester
  event[5] = filters.filter((f) => f.groupId === 3 && f.semester === 2); // 3rd year 2nd semester

  event[6] = filters.filter((f) => f.groupId === 4 && f.semester === 1); // 4th year 1st semester
  event[7] = filters.filter((f) => f.groupId === 4 && f.semester === 2); // 4th year 2nd semester
  event[8] = filters.filter((f) => f.groupId === 5); // 5th year

  event[9] = filters.filter((f) => f.groupId === 0); // others

  const handleToggle = (value: number) => {
    const currentId = checked.indexOf(value);
    const newCheck = [...checked];

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
      return !checked.includes(elem.id);
    });
  };

  const isNoneChecked = (index: number) => {
    return !event[index].some((elem) => {
      return checked.includes(elem.id);
    });
  };

  const handleToggleAll = (values, index: number) => {
    let newChecked = [...checked];

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

  const CheckedIndicator = ({ index }: { index: number }) => {
    const isSomeChecked =
      (!isAllChecked(index) && !isNoneChecked(index)) || isAllChecked(index);

    return (
      <div className={styles.selected_schedules}>
        {isSomeChecked && <div className="ml-1 rounded-full bg-blue-200 p-1" />}
      </div>
    );
  };

  const MultipleCheckedIndicator = ({ index }: { index: number[] }) => {
    const isSomeChecked = index.some((i) => {
      return (!isAllChecked(i) && !isNoneChecked(i)) || isAllChecked(i);
    });

    return (
      <div className={styles.selected_schedules}>
        {isSomeChecked && <div className="ml-1 rounded-full bg-blue-200 p-1" />}
      </div>
    );
  };

  function getCheckBoxes(): CheckBoxProps[][] {
    const checkBoxes: CheckBoxProps[][] = [];

    let i: number;
    for (i = 0; i < event.length; i++) {
      const items: CheckBoxProps[] = event[i].map((e) => {
        const item: CheckBoxProps = { id: e.id, label: e.name };
        return item;
      });

      checkBoxes.push(items);
    }

    return checkBoxes;
  }

  return (
    <>
      <FilterBlock
        layer1={lei}
        layer2={semesters}
        checkBoxes={getCheckBoxes().slice(0, 6)}
        checked={checked}
        setChecked={setChecked}
        handleFilters={handleFilters}
      />
      <FilterBlock
        layer1={mei}
        layer2={semesters}
        checkBoxes={getCheckBoxes().slice(6, 9)}
        checked={checked}
        setChecked={setChecked}
        exception={1}
        handleFilters={handleFilters}
      />
    </>
    // <div className={styles.layer}>
    //   {/* LEI */}

    //   <Collapse className={styles.checkbox} bordered={false} accordion>
    //     {lei.map((b, index1) => (
    //       <>
    //         <MultipleCheckedIndicator
    //           key={index1 - 3}
    //           index={[event_index(0, index1, 0), event_index(0, index1, 1)]}
    //         />
    //         <Panel header={b} key={index1}>
    //           <Collapse
    //             className={styles.sub_checkbox}
    //             bordered={false}
    //             accordion
    //           >
    //             {semesters.map((s, index2) => (
    //               <>
    //                 <CheckedIndicator
    //                   key={10 + index1 * 10 + index2 - 1000}
    //                   index={event_index(0, index1, index2)}
    //                 />
    //                 <Panel header={s} key={10 + index1 * 10 + index2}>
    //                   <Fragment key={100 + index1 * 100 + index2 * 50}>
    //                     <div
    //                       style={{
    //                         padding: "0 0 5px 0",
    //                         margin: "0 0 5px 0",
    //                         borderBottom: "solid rgba(200,200,200,.5) 1px",
    //                       }}
    //                     >
    //                       <Checkbox
    //                         type="Checkbox"
    //                         onClick={() =>
    //                           handleToggleAll(
    //                             event[event_index(0, index1, index2)],
    //                             event_index(0, index1, index2)
    //                           )
    //                         }
    //                         checked={isAllChecked(
    //                           event_index(0, index1, index2)
    //                         )}
    //                         indeterminate={
    //                           !isAllChecked(event_index(0, index1, index2)) &&
    //                           !isNoneChecked(event_index(0, index1, index2))
    //                         }
    //                       >
    //                         Select All
    //                       </Checkbox>
    //                     </div>
    //                   </Fragment>
    //                   <div style={{ fontWeight: 400 }}>
    //                     {event[event_index(0, index1, index2)]?.map(
    //                       (
    //                         value: {
    //                           id: number;
    //                           name: string;
    //                           groupId: number;
    //                           semester: number;
    //                         },
    //                         index3: number
    //                       ) => (
    //                         <Fragment
    //                           key={
    //                             100 + index1 * 100 + index2 * 50 + index3 + 1
    //                           }
    //                         >
    //                           <div>
    //                             <Checkbox
    //                               onChange={() => handleToggle(value.id)}
    //                               type="checkbox"
    //                               checked={
    //                                 Checked.indexOf(value.id) === -1
    //                                   ? false
    //                                   : true
    //                               }
    //                             >
    //                               {value.name}
    //                             </Checkbox>
    //                           </div>
    //                         </Fragment>
    //                       )
    //                     )}
    //                   </div>
    //                 </Panel>
    //               </>
    //             ))}
    //           </Collapse>
    //         </Panel>
    //       </>
    //     ))}
    //   </Collapse>

    //   {/* MEI */}

    //   {/* 4º ano */}

    //   <Collapse className={styles.checkbox} bordered={false} accordion>
    //     <MultipleCheckedIndicator index={[6, 7]} />
    //     <Panel header={mei[0]} key="4">
    //       <Collapse className={styles.sub_checkbox} bordered={false} accordion>
    //         {semesters.map((s, index2) => (
    //           <>
    //             <CheckedIndicator
    //               key={10 + index2 - 1000}
    //               index={event_index(1, 0, index2)}
    //             />
    //             <Panel header={s} key={10 + index2}>
    //               <Fragment key={100 + index2 * 50}>
    //                 <div
    //                   style={{
    //                     padding: "0 0 5px 0",
    //                     margin: "0 0 5px 0",
    //                     borderBottom: "solid rgba(200,200,200,.5) 1px",
    //                   }}
    //                 >
    //                   <Checkbox
    //                     type="Checkbox"
    //                     onClick={() =>
    //                       handleToggleAll(
    //                         event[event_index(1, 0, index2)],
    //                         event_index(1, 0, index2)
    //                       )
    //                     }
    //                     checked={isAllChecked(event_index(1, 0, index2))}
    //                     indeterminate={
    //                       !isAllChecked(event_index(1, 0, index2)) &&
    //                       !isNoneChecked(event_index(1, 0, index2))
    //                     }
    //                   >
    //                     Select All
    //                   </Checkbox>
    //                 </div>
    //               </Fragment>
    //               <div style={{ fontWeight: 400 }}>
    //                 {event[event_index(1, 0, index2)]?.map(
    //                   (
    //                     value: {
    //                       id: number;
    //                       name: string;
    //                       groupId: number;
    //                       semester: number;
    //                     },
    //                     index3: number
    //                   ) => (
    //                     <Fragment key={100 + index2 * 50 + index3 + 1}>
    //                       <div>
    //                         <Checkbox
    //                           onChange={() => handleToggle(value.id)}
    //                           type="checkbox"
    //                           checked={
    //                             Checked.indexOf(value.id) === -1 ? false : true
    //                           }
    //                         >
    //                           {value.name}
    //                         </Checkbox>
    //                       </div>
    //                     </Fragment>
    //                   )
    //                 )}
    //               </div>
    //             </Panel>
    //           </>
    //         ))}
    //       </Collapse>
    //     </Panel>

    //     {/* 5º ano */}

    //     <>
    //       <CheckedIndicator index={8} />
    //       <Panel header={mei[1]} key="5">
    //         <div style={{ fontWeight: 400 }}>
    //           {event[8]?.map(
    //             (
    //               value: {
    //                 id: number;
    //                 name: string;
    //                 groupId: number;
    //                 semester: number;
    //               },
    //               index: number
    //             ) => (
    //               <Fragment key={100 + 100 + index}>
    //                 <div>
    //                   <Checkbox
    //                     onChange={() => handleToggle(value.id)}
    //                     type="checkbox"
    //                     checked={
    //                       Checked.indexOf(value.id) === -1 ? false : true
    //                     }
    //                   >
    //                     {value.name}
    //                   </Checkbox>
    //                 </div>
    //               </Fragment>
    //             )
    //           )}
    //         </div>
    //       </Panel>
    //     </>
    //   </Collapse>

    //   {/* Others */}

    //   {event[9].length > 0 && (
    //     <Collapse className={styles.checkbox} bordered={false}>
    //       <CheckedIndicator index={9} />
    //       <Panel header="Others" key="Others">
    //         <div style={{ fontWeight: 400 }}>
    //           {event[9]?.map(
    //             (
    //               value: {
    //                 id: number;
    //                 name: string;
    //                 groupId: number;
    //                 semester: number;
    //               },
    //               index: number
    //             ) => (
    //               <Fragment key={100 + index}>
    //                 <div>
    //                   <Checkbox
    //                     onChange={() => handleToggle(value.id)}
    //                     type="checkbox"
    //                     checked={
    //                       Checked.indexOf(value.id) === -1 ? false : true
    //                     }
    //                   >
    //                     {value.name}
    //                   </Checkbox>
    //                 </div>
    //               </Fragment>
    //             )
    //           )}
    //         </div>
    //       </Panel>
    //     </Collapse>
    //   )}
    // </div>
  );
}

export default EventFilters;
