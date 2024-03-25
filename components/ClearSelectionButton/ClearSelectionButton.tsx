import { Popconfirm } from "antd";

const ClearSelectionButton = ({
  isHome,
  isSettings,
  clearSelection,
}: {
  isHome: boolean;
  isSettings: boolean;
  clearSelection: () => void;
}) => {
  return (
    <Popconfirm
      title={"Clear choices?"}
      description={
        "This will remove all your selected " + (isHome ? "events." : "shifts.")
      }
      onConfirm={() => clearSelection()}
      onCancel={() => {}}
      okText="Clear"
      showCancel={false}
      icon={<i className="bi bi-exclamation-circle-fill text-error"></i>}
      okButtonProps={{
        className: `${isSettings ? "hidden" : "bg-blue-500"}`,
      }}
      cancelButtonProps={{ className: `${isSettings && "hidden"}` }}
      disabled={isSettings}
    >
      <button
        className={`h-10 w-10 rounded-xl p-2 font-medium leading-3 text-error/50 shadow-md ring-1 ring-neutral-200/50 transition-all duration-300 hover:text-error hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-neutral-800/70 dark:text-red-400/60 dark:ring-neutral-400/20 dark:hover:text-red-400 ${
          isSettings && "cursor-not-allowed hover:text-error/50"
        }`}
        title="Clear"
        type="button"
      >
        <i className="bi bi-trash-fill"></i>
      </button>
    </Popconfirm>
  );
};

export default ClearSelectionButton;
