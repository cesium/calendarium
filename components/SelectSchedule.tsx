import React, { useState } from "react";
import { Checkbox, Collapse } from "antd";
import "antd/dist/antd.css";
import { IFilterDTO } from "../dtos";

const { Panel } = Collapse;

interface ISelectedFilter {
  id: number;
  shift: string;
}

interface ISelectScheduleProps {
  filters: IFilterDTO[];
  handleFilters: (selectedFilter: ISelectedFilter[]) => void;
}

export const SelectSchedule = ({
  filters,
  handleFilters,
}: ISelectScheduleProps) => {
  //Initial state for the CheckBox and the update function
  const [selectedFilters, setSelectedFilters] = useState<ISelectedFilter[]>([]);

  //Arrays for each group and subgroup to build the filter
  const year_one_one = filters.filter(
    (f) => f.groupId === 1 && f.semester === 1
  );
  const year_one_two = filters.filter(
    (f) => f.groupId === 1 && f.semester === 2
  );

  const year_two_one = filters.filter(
    (f) => f.groupId === 2 && f.semester === 1
  );
  const year_two_two = filters.filter(
    (f) => f.groupId === 2 && f.semester === 2
  );

  const year_three_one = filters.filter(
    (f) => f.groupId === 3 && f.semester === 1
  );
  const year_three_two = filters.filter(
    (f) => f.groupId === 3 && f.semester === 2
  );

  const year_four_one = filters.filter(
    (f) => f.groupId === 4 && f.semester === 1
  );
  const year_four_two = filters.filter(
    (f) => f.groupId === 4 && f.semester === 2
  );

  const year_five = filters.filter((f) => f.groupId === 5);

  const others = filters.filter((f) => f.groupId === 0);

  //Function to the handle the change
  const handleToggle = (filterId: number, shift?: string) => {
    const findedFilterIndex = selectedFilters.findIndex(
      (selectedFilter) =>
        selectedFilter.id === filterId && selectedFilter.shift === shift
    );

    const newSelctedFilters = [...selectedFilters];

    if (findedFilterIndex === -1) {
      newSelctedFilters.push({ id: filterId, shift });
    } else {
      newSelctedFilters.splice(findedFilterIndex, 1);
    }

    setSelectedFilters(newSelctedFilters);

    // Function to export the filters
    handleFilters(newSelctedFilters);
  };

  /*CheckBox creation using Collapse for each subgroup and 
    mapping the values in each array*/
  return (
    <Collapse>
      <Panel header="filters" key={""}>
        <Collapse>
          <Panel header="1st Year (Graduation)" key="1">
            <Collapse>
              <Panel header="1st Semester" key={""}>
                {year_one_one.map((value, index) =>
                  value.shifts?.length ? (
                    <h1>Teste</h1>
                  ) : (
                    <Checkbox
                      key={index}
                      onChange={() => handleToggle(value.id)}
                      type="checkbox"
                    >
                      {value.name}
                    </Checkbox>
                  )
                )}
              </Panel>
            </Collapse>

            <Collapse>
              <Panel header="2nd Semester" key={""}>
                {year_one_two.map((filter, index) =>
                  filter.shifts?.length ? (
                    filter.shifts.map((shiftOption) => (
                      <React.Fragment key={shiftOption}>
                        <Checkbox
                          key={index}
                          onChange={() => handleToggle(filter.id, shiftOption)}
                          type="checkbox"
                        >
                          {filter.name} - {shiftOption}
                        </Checkbox>

                        <br />
                      </React.Fragment>
                    ))
                  ) : (
                    <React.Fragment key={filter.id}>
                      <Checkbox
                        key={index}
                        onChange={() => handleToggle(filter.id)}
                        type="checkbox"
                      >
                        {filter.name}
                      </Checkbox>

                      <br />
                    </React.Fragment>
                  )
                )}
              </Panel>
            </Collapse>
          </Panel>
        </Collapse>

        <Collapse>
          <Panel header="2nd Year (Graduation)" key="2">
            <Collapse>
              <Panel header="1st Semester" key={""}>
                {year_two_one.map((value, index) => (
                  <React.Fragment key={index}>
                    <Checkbox
                      onChange={() => handleToggle(value.id)}
                      type="checkbox"
                    >
                      {value.name}
                    </Checkbox>
                  </React.Fragment>
                ))}
              </Panel>
            </Collapse>

            <Collapse>
              <Panel header="2nd Semester" key={""}>
                {year_two_two.map((value, index) => (
                  <React.Fragment key={index}>
                    <Checkbox
                      onChange={() => handleToggle(value.id)}
                      type="checkbox"
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
              <Panel header="1st Semester" key={""}>
                {year_three_one.map((value, index) => (
                  <React.Fragment key={index}>
                    <Checkbox
                      onChange={() => handleToggle(value.id)}
                      type="checkbox"
                    >
                      {value.name}
                    </Checkbox>
                  </React.Fragment>
                ))}
              </Panel>
            </Collapse>

            <Collapse>
              <Panel header="2nd Semester" key={""}>
                {year_three_two.map((value, index) => (
                  <React.Fragment key={index}>
                    <Checkbox
                      onChange={() => handleToggle(value.id)}
                      type="checkbox"
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
              <Panel header="1st Semester" key={""}>
                {year_four_one.map((value, index) => (
                  <React.Fragment key={index}>
                    <Checkbox
                      onChange={() => handleToggle(value.id)}
                      type="checkbox"
                    >
                      {value.name}
                    </Checkbox>
                  </React.Fragment>
                ))}
              </Panel>
            </Collapse>

            <Collapse>
              <Panel header="2nd Semester (Profiles)" key={""}>
                {year_four_two.map((value, index) => (
                  <React.Fragment key={index}>
                    <Checkbox
                      onChange={() => handleToggle(value.id)}
                      type="checkbox"
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
};
