import { useState } from "react";

import { Modal, Box, Fade, Backdrop, Typography } from "@mui/material";

import { Collapse } from "antd";

const Install = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <label htmlFor="app" className="block text-sm font-medium leading-6 ">
        App
      </label>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-2 rounded-lg bg-cesium-100 p-2 font-medium text-cesium-900 shadow-sm transition-colors hover:bg-cesium-200 dark:bg-cesium-700/20 dark:hover:bg-cesium-700/30"
      >
        Install <i className="bi bi-download" />
      </button>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 400 } }}
      >
        <Fade in={isModalOpen} timeout={400}>
          <Box
            className="absolute left-1/2 top-1/2 h-fit w-full min-w-[18rem] max-w-full -translate-x-1/2 -translate-y-1/2 transform rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-xl dark:border-neutral-400/20 dark:bg-neutral-800 sm:w-80"
            style={{
              maxHeight: "calc(100% - 4rem)",
              maxWidth: "calc(100% - 4rem)",
            }}
          >
            <div className="w-full space-y-4 font-display">
              <span
                id="modal-modal-title"
                className="select-none text-xl font-medium"
              >
                Install Calendarium <i className="bi bi-download"></i>
              </span>
              <div className="rounded-lg bg-blue-500/20 p-2 text-sm ">
                <i className="bi bi-info-circle-fill text-blue-500"></i> You can
                install Calendarium as a{" "}
                <a
                  className="font-semibold hover:underline"
                  href="https://pt.wikipedia.org/wiki/Progressive_web_app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  PWA {"("}Progressive Web App{")"}
                </a>{" "}
                <i className="bi bi-box-arrow-up-right"></i> on your device.
              </div>
              <Collapse
                className="w-full rounded-lg border-neutral-300 bg-white text-left font-display shadow-sm"
                accordion
              >
                <Collapse.Panel header="Android" key="1">
                  <ol className="ml-6 list-decimal">
                    <li>
                      Open <a className="font-medium">Chrome</a>.
                    </li>
                    <li>Navigate to the app URL.</li>
                    <li>
                      Tap the <a className="font-medium">three dots</a> in the
                      top right.
                    </li>
                    <li>
                      Choose {'"'}Install{'"'} or {'"'}Add to Home Screen{'"'}.
                    </li>
                    <li>Follow the prompts to install the app.</li>
                  </ol>
                </Collapse.Panel>
                <Collapse.Panel header="iOS" key="2">
                  <ol className="ml-6 list-decimal">
                    <li>
                      Open <a className="font-medium">Safari</a>.
                    </li>
                    <li>Navigate to the app URL.</li>
                    <li>
                      Tap the <a className="font-medium">Share button</a> at the
                      bottom.
                    </li>
                    <li>
                      Choose {'"'}Add to Home Screen.{'"'}
                    </li>
                    <li>Follow the prompts to install the app.</li>
                  </ol>
                </Collapse.Panel>
                <Collapse.Panel header="Desktop" key="3">
                  <ol className="ml-6 list-decimal">
                    <li>Open your browser.</li>
                    <li>Navigate to the app URL.</li>
                    <li>Look for the browser{"'"}s menu or settings.</li>
                    <li>
                      Choose the option related to installing or adding to the
                      home screen.
                    </li>
                    <li>Follow the prompts to install the app.</li>
                  </ol>
                </Collapse.Panel>
              </Collapse>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default Install;
