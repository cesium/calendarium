import React, { useState } from "react";
import { Checkbox, Collapse, Popconfirm } from "antd";
import "antd/dist/reset.css";
import { IFilterDTO } from "../../dtos";
import styles from "./selectschedule.module.scss";
import { CaretRightOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

interface ISelectedFilter {
  id: number;
  shift: string;
}

interface ISelectScheduleProps {
  filters: IFilterDTO[];
  handleFilters: (selectedFilter: ISelectedFilter[]) => void;
}

interface IOptionProps {
  filter: IFilterDTO;
  handleToggle: (filterId: number, shiftOption?: string) => void;
  isChecked: ({ id, shift }) => boolean;
}

const OptionWithShifts = ({
  filter,
  handleToggle,
  isChecked,
}: IOptionProps) => (
  <>
    <div className="flex row w-full">
      <Collapse
        className={styles.sub_sub_checkbox}
        bordered={false}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
        key={filter.id}
      >
        <Panel header={filter.name} key={filter.id}>
          {filter.shifts.map((shiftOption) => (
            <>
              <Checkbox
                key={filter.id}
                onChange={() => handleToggle(filter.id, shiftOption)}
                type="checkbox"
                checked={isChecked({ id: filter.id, shift: shiftOption })}
              >
                {shiftOption}
              </Checkbox>

              <br />
            </>
          ))}
        </Panel>

      </Collapse>
      <span className="flex row items-center space-x-2 right-0 top-0 ">
        {filter.shifts.map((shiftOption) => (
          isChecked({ id: filter.id, shift: shiftOption }) ?
            (<span className="bg-blue-200 rounded-lg p-2">
              {shiftOption}
            </span>)
            : (<></>)

        ))}
      </span>
    </div>
  </>
);

const Option = ({ filter, handleToggle, isChecked }: IOptionProps) => (
  <>
    <Checkbox
      key={filter.id}
      onChange={() => {
        handleToggle(filter.id);
      }}
      type="checkbox"
      checked={isChecked({ id: filter.id, shift: undefined })}
    >
      {filter.name}
    </Checkbox>

    <br />
  </>
);

const SelectSchedule = ({ filters, handleFilters }: ISelectScheduleProps) => {
  // Initial state for the CheckBox and the update function
  const [selectedFilters, setSelectedFilters] = useState<ISelectedFilter[]>([]);
  React.useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("shifts")) ?? [];
    setSelectedFilters(stored);
    handleFilters(stored);
  }, []);

  // Arrays for each group and subgroup to build the filter

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

  const functions = [
    year_one_one,
    year_one_two,
    year_two_one,
    year_two_two,
    year_three_one,
    year_three_two,
    year_four_one,
    year_four_two,
  ];

  // Function to handle the change
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
    localStorage.setItem("shifts", JSON.stringify(newSelctedFilters));
    // Function to export the filters
    handleFilters(newSelctedFilters);
  };

  function clearSelection() {
    setSelectedFilters([]);
    localStorage.setItem("shifts", JSON.stringify([]));
    handleFilters([]);
  }

  const mei = ["1ˢᵗ year"];

  const lei = ["1ˢᵗ year", "2ⁿᵈ year", "3ʳᵈ year"];

  const semesters = ["1ˢᵗ semester", "2ⁿᵈ semester"];

  const isChecked = (obj: { id; shift }) => {
    return selectedFilters.some((element) => {
      return obj.id === Number(element.id) && obj.shift === element.shift;
    });
  };

  return (

    <div className={styles.filters}>
      {/* LEI */}
      <Collapse
        className={styles.checkbox}
        bordered={false}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
      >
        <Panel header="LEI" key="panel">
          <div className={styles.items}>
            {lei.map((y, index1) => (
              <Collapse
                className={styles.sub_checkbox}
                bordered={false}
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                key={index1}
              >
                <Panel header={y} key={index1}>
                  {semesters.map((s, index2) => (
                    <Collapse
                      className={styles.sub_sub_checkbox}
                      bordered={false}
                      expandIcon={({ isActive }) => (
                        <CaretRightOutlined rotate={isActive ? 90 : 0} />
                      )}
                      key={index2}
                    >
                      <Panel header={s} key={index2}>
                        {functions[index1 * 2 + index2].map((filter) =>
                          filter.shifts?.length ? (
                            <OptionWithShifts
                              key={filter.id}
                              filter={filter}
                              handleToggle={handleToggle}
                              isChecked={isChecked}
                            />
                          ) : (
                            <Option
                              key={filter.id}
                              filter={filter}
                              handleToggle={handleToggle}
                              isChecked={isChecked}
                            />
                          )
                        )}
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
        <Panel header="MEI" key="panel">
          <div className={styles.items}>
            {mei.map((y, index1) => (
              <Collapse
                className={styles.sub_checkbox}
                bordered={false}
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                key={index1}
              >
                <Panel header={y} key={index1}>
                  {semesters.map((s, index2) => (
                    <Collapse
                      className={styles.sub_sub_checkbox}
                      bordered={false}
                      expandIcon={({ isActive }) => (
                        <CaretRightOutlined rotate={isActive ? 90 : 0} />
                      )}
                      key={index2}
                    >
                      <Panel header={s} key={index2}>
                        {functions[(index1 + 3) * 2 + index2].map((filter) =>
                          filter.shifts?.length ? (
                            <OptionWithShifts
                              key={filter.id}
                              filter={filter}
                              handleToggle={handleToggle}
                              isChecked={isChecked}
                            />
                          ) : (
                            <Option
                              key={filter.id}
                              filter={filter}
                              handleToggle={handleToggle}
                              isChecked={isChecked}
                            />
                          )
                        )}
                      </Panel>
                    </Collapse>
                  ))}
                </Panel>
              </Collapse>
            ))}
            <Collapse
              className={styles.sub_checkbox}
              bordered={false}
              expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0} />
              )}
            >
              <Panel header="2ⁿᵈ year" key="5">
                {year_five.map((filter) =>
                  filter.shifts?.length ? (
                    <OptionWithShifts
                      key={filter.id}
                      filter={filter}
                      handleToggle={handleToggle}
                      isChecked={isChecked}
                    />
                  ) : (
                    <div style={{ fontWeight: 400 }}>
                      <Option
                        key={filter.id}
                        filter={filter}
                        handleToggle={handleToggle}
                        isChecked={isChecked}
                      />
                    </div>
                  )
                )}
              </Panel>
            </Collapse>
          </div>
        </Panel>
      </Collapse >

      {/* Others */}

      < Collapse
        className={styles.checkbox}
        bordered={false}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
      >
        <Panel header="Others" key="0">
          {others.map((filter) =>
            filter.shifts?.length ? (
              <OptionWithShifts
                key={filter.id}
                filter={filter}
                handleToggle={handleToggle}
                isChecked={isChecked}
              />
            ) : (
              <div style={{ fontWeight: 400 }}>
                <Option
                  key={filter.id}
                  filter={filter}
                  handleToggle={handleToggle}
                  isChecked={isChecked}
                />
              </div>
            )
          )}
        </Panel>
      </Collapse >

      <Popconfirm
        title="Are you sure?"
        description="This will remove all your classes"
        onConfirm={() => {
          clearSelection();
        }}
        onCancel={() => { }}
        okText="Ok"
        cancelText="Cancel"
        icon={
          <i
            className="bi bi-exclamation-circle-fill"
            style={{ color: "#faad14" }}
          ></i>
        }
      >
        <button className={styles.clearButton}>
          Clear Schedule <i className="bi bi-stars"></i>
        </button>
      </Popconfirm>
    </div >
  );
};

export default SelectSchedule;
