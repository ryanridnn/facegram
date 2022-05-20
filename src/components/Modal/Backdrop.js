import { motion } from "framer-motion";

function Backdrop() {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{
				opacity: 0.4,
				transition: { duration: 0.4, ease: "easeInOut" },
			}}
			exit={{
				opacity: 0,
				transition: { duration: 0.4, ease: "easeInOut" },
			}}
			className=" w-full h-full flex justify-center items-center bg-black"
		></motion.div>
	);
}

export default Backdrop;
