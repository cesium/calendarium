import { useAppInfo } from "../../contexts/AppInfoProvider";
import ConfirmPopUpButton from "../ConfirmPopUpButton";

const ClearSelectionButton = ({
  isSettings,
  clearSelection,
}: {
  isSettings: boolean;
  clearSelection: () => void;
}) => {
  let classNameData = `h-10 w-10 rounded-xl p-2 font-medium leading-3 text-error/50 shadow-md ring-1 ring-neutral-200/50 transition-all duration-300 hover:text-error hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-neutral-800/70 dark:text-red-400/60 dark:ring-neutral-400/20 dark:hover:text-red-400 ${
    isSettings &&
    "cursor-not-allowed hover:text-error/50 dark:hover:text-red-400/60"
  }`;

  const info = useAppInfo();

  return (
    <ConfirmPopUpButton
      title={"Are you sure?"}
      description={
        "This will remove all your selected " +
        (info.isEvents ? "events." : "shifts.")
      }
      onConfirm={() => clearSelection()}
      onCancel={() => {}}
      okText="Clear"
      showCancel={false}
      icon={<i className="bi bi-exclamation-circle-fill text-error"></i>}
      buttonProps={{
        disabled: isSettings,
        type: "button",
        title: "Clear",
        className: classNameData,
        "data-umami-event": "clear-selection-button",
        "data-umami-event-type": isHome ? "events" : "shifts",
      }}
    >
      <i className="bi bi-trash-fill"></i>
    </ConfirmPopUpButton>
  );
};

export default ClearSelectionButton;
