import { Fragment, ReactNode } from "react";
import { Menu, Transition } from "@headlessui/react";

type ConfirmPopUpButtonProps = {
  children: ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  okText?: string;
  cancelText?: string;
  showCancel?: boolean;
  icon?: ReactNode;
  buttonProps?: any;
};

const ConfirmPopUpButton = ({
  children,
  title,
  description,
  onConfirm,
  onCancel,
  okText = "Ok",
  cancelText = "Cancel",
  showCancel = true,
  icon = <i className="bi bi-info-circle-fill text-blue-500"></i>,
  buttonProps = {},
}: ConfirmPopUpButtonProps) => {
  return (
    <Menu as="div" className="relative inline-block">
      <Menu.Button {...buttonProps}>{children}</Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div className="absolute left-0 z-10 mt-2 flex w-44 origin-top-left flex-col items-center justify-center space-y-3 rounded-xl bg-white p-4 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-[#212121] dark:ring-white/20">
          <div className="flex items-center space-x-2">
            {icon}
            <span className="font-bold">{title}</span>
          </div>
          <div className="text-center">{description}</div>
          <div className="grid w-full grid-cols-2 gap-2">
            {showCancel && (
              <button
                onClick={onCancel}
                className="rounded-md bg-neutral-200 p-1 px-2 shadow-sm transition-all hover:bg-opacity-80 dark:bg-neutral-600 dark:text-white dark:hover:bg-opacity-80"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={onConfirm}
              className={`rounded-md bg-blue-500 p-1 px-2 text-white shadow-sm transition-all hover:bg-opacity-80 ${
                !showCancel && "col-span-2"
              }`}
            >
              {okText}
            </button>
          </div>
        </div>
      </Transition>
    </Menu>
  );
};

export default ConfirmPopUpButton;
