import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

import PulseLoader from "react-spinners/PulseLoader";

const ActionListPopup = ({ popupOpened, setPopupOpened, actionList }) => {
  const [loadingAction, setLoadingAction] = useState(null);

  return (
    <AnimatePresence>
      {popupOpened && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.05 }}
          className="absolute z-10 top-14 right-0 w-64 bg-white rounded-xl shadow-md transition linear duration-150 hover:shadow-xl overflow-hidden border border-gray-50 origin-top-right text-sm sm:text-base"
        >
          {actionList.map((action, i) =>
            action.type && action.type === "navigate" ? (
              <Link
                key={i}
                to={action.path}
                className="group flex gap-3 items-center w-full p-4 border-b-1 border-b-gray-300 rounded-lg transition linear duration-150 hover:bg-gray-100"
              >
                {action.icon && (
                  <action.icon className="h-6 text-[#555555] transition linear group-hover:translate-x-4" />
                )}
                <div className="font-medium transition linear group-hover:translate-x-4">
                  {action.actionName}
                </div>
              </Link>
            ) : (
              <button
                key={i}
                onClick={() => {
                  const value = action.handler();
                  if (value.then && typeof value.then === "function") {
                    setLoadingAction(action.actionName);
                  }
                }}
                className="group flex gap-3 items-center w-full p-4 border-b-1 border-b-gray-300 rounded-lg transition linear duration-150 hover:bg-gray-100"
              >
                {action.icon && (
                  <action.icon className="h-5 sm:h-6 text-[#555555] transition linear group-hover:translate-x-4" />
                )}
                <div
                  className={`font-medium transition linear group-hover:translate-x-4 ${
                    action.actionName === loadingAction && "ml-4"
                  }`}
                >
                  {loadingAction === action.actionName ? (
                    <PulseLoader size={10} color={"#555"} />
                  ) : (
                    action.actionName
                  )}
                </div>
              </button>
            )
          )}
          <button
            className="group flex gap-3 items-center w-full p-4 border-b-1 border-b-gray-300 rounded-lg text-red-400 font-bold transition linear duration-150 hover:bg-red-50"
            onClick={() => setPopupOpened(false)}
          >
            Cancel
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ActionListPopup;
