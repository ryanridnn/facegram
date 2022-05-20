import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSwiper } from "swiper/react";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";

const SwiperNavButtons = ({ hover, progress }) => {
	const [buttonOpacity, setButtonOpacity] = useState(0);
	const swiper = useSwiper();

	const next = () => {
		swiper.slideNext();
	};

	const prev = () => {
		swiper.slidePrev();
	};

	useEffect(() => {
		if (hover) setButtonOpacity(1);
		else setButtonOpacity(0);
	}, [hover]);

	return (
		<>
			{progress !== 0 && (
				<motion.button
					onClick={prev}
					initial={{ opacity: 0 }}
					animate={{
						opacity: buttonOpacity,
						transition: { duration: 0.15 },
					}}
					whileHover={{ opacity: 1, transition: { duration: 0.15 } }}
					className="h-12 w-12 rounded-full bg-primary absolute top-1/2 -translate-y-1/2 left-2 flex justify-center items-center z-30"
				>
					<ChevronLeftIcon className="h-6 w-6 text-white" />
				</motion.button>
			)}
			{progress !== 1 && (
				<motion.button
					onClick={next}
					initial={{ opacity: 0 }}
					animate={{
						opacity: buttonOpacity,
						transition: { duration: 0.15 },
					}}
					whileHover={{ opacity: 1, transition: { duration: 0.15 } }}
					className="h-12 w-12 rounded-full bg-primary absolute top-1/2 -translate-y-1/2 right-2 flex justify-center items-center z-30"
				>
					<ChevronRightIcon className="h-6 w-6 text-white" />
				</motion.button>
			)}
		</>
	);
};

export default SwiperNavButtons;
