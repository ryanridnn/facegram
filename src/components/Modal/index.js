import { motion, AnimatePresence } from "framer-motion";

//component
import Backdrop from "./Backdrop";

//icon
import { XIcon } from "@heroicons/react/solid";

const Modal = ({ title, modalOpened, setModalOpened, size, children }) => {
	return (
		<AnimatePresence>
			{modalOpened && (
				<div className="fixed top-0 right-0 z-20 w-screen h-screen max-h-screen">
					<Backdrop />
					<motion.div
						initial={{ y: "-80%", x: "-50%", opacity: 0 }}
						animate={{
							y: "-50%",
							opacity: 1,
							transition: { duration: 0.3, ease: "easeInOut" },
						}}
						exit={{
							y: "-80%",
							x: "-50%",
							opacity: 0,
							transition: { duration: 0.3, ease: "easeInOut" },
						}}
						className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:w-11/12 h-screen sm:h-auto max-h-screen z-30 bg-white rounded-none sm:rounded-2xl overflow-y-auto"
						style={{
							maxWidth: "100%",
							width:
								size === "full-container" ? "680px" : "500px",
						}}
					>
						<div className="relative flex justify-center items-center text-xl font-medium p-4 sm:p-6">
							{title}
							<motion.button
								initial={{ y: "-50%" }}
								whileHover={{
									scale: 1.23,
									y: "-50%",
									transition: { duration: 0.15 },
								}}
								onClick={() => setModalOpened(false)}
								className="absolute top-1/2 -translate-y-1/2 right-6 bg-red-100 w-9 h-9 flex justify-center items-center rounded-full"
							>
								<XIcon className="h-5 text-red-400" />
							</motion.button>
						</div>
						{children}
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
};

export default Modal;
