import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useAppInfo } from "../../contexts/AppInfoProvider";

const MoreButton = ({ isOpen }: { isOpen: boolean }) => {
  const info = useAppInfo();

  return (
    <div
      className={`fixed bottom-0 right-0 z-50 transform p-4 transition duration-300 lg:translate-x-0 lg:translate-y-0 ${
        !isOpen && "translate-x-full translate-y-full"
      }`}
    >
      <Menu as="div" className="relative inline-block">
        <Menu.Button className="size-11 rounded-xl bg-cesium-900 p-2 leading-3 text-neutral-100 shadow-md ring-1 ring-cesium-900/50 transition-all duration-300 hover:bg-[#ed906f] hover:shadow-cesium-900/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cesium-500 dark:ring-cesium-900/20">
          <i className="bi bi-three-dots"></i>
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute bottom-full right-0 mb-3 origin-bottom-right">
            <div className="flex w-fit flex-col items-center justify-center overflow-hidden text-nowrap rounded-xl bg-white font-medium shadow-md ring-1 ring-neutral-200/50 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500 dark:bg-[#212121] dark:ring-neutral-400/20">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() =>
                      window.open("https://forms.gle/C2uxuUKqoeqMWfcZ6")
                    }
                    className="inline-flex w-full items-center justify-center gap-2 border-b border-neutral-200/20 px-3 py-2 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800/90"
                  >
                    <i className="bi bi-chat-fill"></i> Feedback
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() =>
                      window.open(
                        info.isEvents
                          ? "https://docs.google.com/forms/d/e/1FAIpQLSfpk0mJowLtjPdJo99NOVDD5G8IX0UPMWOO6g5ngJ1gZNMsqQ/viewform"
                          : "https://alunos.uminho.pt/pt/estudantes/paginas/infouteishorarios.aspx"
                      )
                    }
                    className="inline-flex w-full items-center justify-center gap-2 px-3 py-2 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800/90"
                  >
                    {info.isEvents ? (
                      <>
                        <i className="bi bi-calendar-plus-fill"></i> Add Event
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-up-right" /> Horários
                        UMinho
                      </>
                    )}
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default MoreButton;
