import { useState, useEffect } from "react";
import { Swiper, SwiperSlide as Slide, useSwiper } from "swiper/react";
import { motion } from "framer-motion";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";

const Media = ({ media }) => {
	const [hover, setHover] = useState(false);
	const [progress, setProgress] = useState(0);

	return (
		<Swiper
			className="relative"
			onProgress={(swiper, progress) => setProgress(progress)}
		>
			<SwiperNav total={media.length} progress={progress} />
			{media.map((m, i) => (
				<Slide
					key={i}
					onMouseOver={() => setHover(true)}
					onMouseLeave={() => setHover(false)}
				>
					<img src={m.photo} className="w-full" alt="media" />
					{media.length !== 1 && (
						<NavButtons
							hover={hover}
							total={media.length}
							progress={progress}
						/>
					)}
				</Slide>
			))}
		</Swiper>
	);
};

const NavButtons = ({ hover, total, progress }) => {
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

const SwiperNav = ({ total, progress }) => {
	const getNavMatch = (i) => {
		const currentSlide = Math.ceil(total * progress);
		if (currentSlide === 0) return 1 === i + 1;
		else return currentSlide === i + 1;
	};

	return (
		total !== 1 && (
			<div className="absolute bottom-0 w-full h-8 sm:h-14 flex justify-center items-center gap-2.5 z-40 pointer-events-none">
				{Array.from({ length: total }).map((n, i) => (
					<div
						key={i}
						className={`h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-white drop-shadow-2xl ${
							getNavMatch(i) ? "opacity-100" : "opacity-60"
						}`}
					></div>
				))}
			</div>
		)
	);
};

export default Media;
