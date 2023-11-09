import { Popconfirm } from "antd";

const ClearScheduleButton = ({
  isSettings,
  clearSchedule,
}: {
  isSettings: boolean;
  clearSchedule: () => void;
}) => {
  return (
    <Popconfirm
      title={isSettings ? "ERROR" : "Are you sure?"}
      description={
        isSettings
          ? "You can't clear your schedule while in settings."
          : "This will remove all your classes."
      }
      onConfirm={() => clearSchedule()}
      onCancel={() => {}}
      okText="Ok"
      cancelText={"Cancel"}
      icon={
        isSettings ? (
          <i className="bi bi-exclamation-circle-fill text-error"></i>
        ) : (
          <i className="bi bi-question-circle-fill text-warning"></i>
        )
      }
      okButtonProps={{
        className: `${isSettings ? "hidden" : "bg-blue-500"}`,
      }}
      cancelButtonProps={{ className: `${isSettings && "hidden"}` }}
    >
      <button className="mb-3 h-10 w-full rounded-2xl bg-highlight p-2 font-medium leading-3 text-white shadow-md transition-shadow duration-300 hover:shadow-lg hover:shadow-highlight/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        Clear Schedule <i className="bi bi-stars"></i>
      </button>
    </Popconfirm>
  );
};

export default ClearScheduleButton;
