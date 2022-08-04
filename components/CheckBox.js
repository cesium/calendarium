import React, { useState } from "react";
import { Checkbox, Collapse } from "antd";
import Filters from "./Filters";
import "antd/dist/antd.css";

const { Panel } = Collapse;

//Arrays for each group and subgroup to build the filter
const year_one_one = Filters.filter((f) => f.groupId === 1 && f.semester === 1);
const year_one_two = Filters.filter((f) => f.groupId === 1 && f.semester === 2);

const year_two_one = Filters.filter((f) => f.groupId === 2 && f.semester === 1);
const year_two_two = Filters.filter((f) => f.groupId === 2 && f.semester === 2);

const year_three_one = Filters.filter(
  (f) => f.groupId === 3 && f.semester === 1
);
const year_three_two = Filters.filter(
  (f) => f.groupId === 3 && f.semester === 2
);

const year_four_one = Filters.filter(
  (f) => f.groupId === 4 && f.semester === 1
);
const year_four_two = Filters.filter(
  (f) => f.groupId === 4 && f.semester === 2
);

const year_five = Filters.filter((f) => f.groupId === 5);

const others = Filters.filter((f) => f.groupId === 0);

function CheckBox(props) {
  //Initial state for the CheckBox and the update function
  const [Checked, setChecked] = useState([]);

  //Function to the handle the change
  const handleToggle = (value) => {
    const currentId = Checked.indexOf(value);
    const newCheck = [...Checked];

    if (currentId === -1) {
      newCheck.push(value);
    } else {
      newCheck.splice(currentId, 1);
    }

    setChecked(newCheck);

    //Function to export the filters
    props.handleFilters(newCheck);
  };

  /*CheckBox creation using Collapse for each subgroup and 
    mapping the values in each array*/
  return (
    <Collapse>
      <Panel header="Filters">
        <Collapse>
          <Panel header="1st Year (Graduation)" key="1">
            <Collapse>
              <Panel header="1st Semester">
                {year_one_one.map((value, index) => (
                  <React.Fragment key={index}>
                    <Checkbox
                      onChange={() => handleToggle(value.id)}
                      type="checkbox"
                      checked={Checked.indexOf(value.id) === -1 ? false : true}
                    >
                      {value.name}
                    </Checkbox>
                  </React.Fragment>
                ))}
              </Panel>
            </Collapse>

            <Collapse>
              <Panel header="2nd Semester">
                {year_one_two.map((value, index) => (
                  <React.Fragment key={index}>
                    <Checkbox
                      onChange={() => handleToggle(value.id)}
                      type="checkbox"
                      checked={Checked.indexOf(value.id) === -1 ? false : true}
                    >
                      {value.name}
                    </Checkbox>
                  </React.Fragment>
                ))}
              </Panel>
            </Collapse>
          </Panel>
        </Collapse>

        <Collapse>
          <Panel header="2nd Year (Graduation)" key="2">
            <Collapse>
              <Panel header="1st Semester">
                {year_two_one.map((value, index) => (
                  <React.Fragment key={index}>
                    <Checkbox
                      onChange={() => handleToggle(value.id)}
                      type="checkbox"
                      checked={Checked.indexOf(value.id) === -1 ? false : true}
                    >
                      {value.name}
                    </Checkbox>
                  </React.Fragment>
                ))}
              </Panel>
            </Collapse>

            <Collapse>
              <Panel header="2nd Semester">
                {year_two_two.map((value, index) => (
                  <React.Fragment key={index}>
                    <Checkbox
                      onChange={() => handleToggle(value.id)}
                      type="checkbox"
                      checked={Checked.indexOf(value.id) === -1 ? false : true}
                    >
                      {value.name}
                    </Checkbox>
                  </React.Fragment>
                ))}
              </Panel>
            </Collapse>
          </Panel>
        </Collapse>

        <Collapse>
          <Panel header="3rd Year (Graduation)" key="3">
            <Collapse>
              <Panel header="1st Semester">
                {year_three_one.map((value, index) => (
                  <React.Fragment key={index}>
                    <Checkbox
                      onChange={() => handleToggle(value.id)}
                      type="checkbox"
                      checked={Checked.indexOf(value.id) === -1 ? false : true}
                    >
                      {value.name}
                    </Checkbox>
                  </React.Fragment>
                ))}
              </Panel>
            </Collapse>

            <Collapse>
              <Panel header="2nd Semester">
                {year_three_two.map((value, index) => (
                  <React.Fragment key={index}>
                    <Checkbox
                      onChange={() => handleToggle(value.id)}
                      type="checkbox"
                      checked={Checked.indexOf(value.id) === -1 ? false : true}
                    >
                      {value.name}
                    </Checkbox>
                  </React.Fragment>
                ))}
              </Panel>
            </Collapse>
          </Panel>
        </Collapse>

        <Collapse>
          <Panel header="1st Year (Masters)" key="4">
            <Collapse>
              <Panel header="1st Semester">
                {year_four_one.map((value, index) => (
                  <React.Fragment key={index}>
                    <Checkbox
                      onChange={() => handleToggle(value.id)}
                      type="checkbox"
                      checked={Checked.indexOf(value.id) === -1 ? false : true}
                    >
                      {value.name}
                    </Checkbox>
                  </React.Fragment>
                ))}
              </Panel>
            </Collapse>

            <Collapse>
              <Panel header="2nd Semester (Profiles)">
                {year_four_two.map((value, index) => (
                  <React.Fragment key={index}>
                    <Checkbox
                      onChange={() => handleToggle(value.id)}
                      type="checkbox"
                      checked={Checked.indexOf(value.id) === -1 ? false : true}
                    >
                      {value.name}
                    </Checkbox>
                  </React.Fragment>
                ))}
              </Panel>
            </Collapse>
          </Panel>
        </Collapse>

        <Collapse>
          <Panel header="2nd Year (Masters)" key="5">
            {year_five.map((value, index) => (
              <React.Fragment key={index}>
                <Checkbox
                  onChange={() => handleToggle(value.id)}
                  type="checkbox"
                  checked={Checked.indexOf(value.id) === -1 ? false : true}
                >
                  {value.name}
                </Checkbox>
              </React.Fragment>
            ))}
          </Panel>
        </Collapse>

        <Collapse>
          <Panel header="Others" key="0">
            {others.map((value, index) => (
              <React.Fragment key={index}>
                <Checkbox
                  onChange={() => handleToggle(value.id)}
                  type="checkbox"
                  checked={Checked.indexOf(value.id) === -1 ? false : true}
                >
                  {value.name}
                </Checkbox>
              </React.Fragment>
            ))}
          </Panel>
        </Collapse>
      </Panel>
    </Collapse>
  );
}

export default CheckBox;
