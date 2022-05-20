import { useSwiper } from "swiper/react";

// icons
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/solid";

const StoriesButtons = ({ progress }) => {
	const swiper = useSwiper();

	const slideNext = () => {
		swiper.slideNext();
		swiper.slideNext();
	};

	const slidePrev = () => {
		swiper.slidePrev();
		swiper.slidePrev();
	};

	return (
		<>
			<div
				className={`absolute z-10 left-2 h-full mt-[26px] ${
					progress > 0 ? "block" : "hidden"
				}`}
				onClick={slidePrev}
			>
				<button className="slide-prev flex justify-center items-center w-8 h-8 sm:w-10 sm:h-10 text-white bg-primary rounded-full shadow-lg hover:scale-125 transition linear duration-150">
					<ChevronLeftIcon className="h-5 sm:h-7" />
				</button>
			</div>
			<div
				className={`absolute z-10 right-2 h-full mt-[26px] ${
					progress < 1 ? "block" : "hidden"
				}`}
				onClick={slideNext}
			>
				<button className="slide-next flex justify-center items-center w-8 h-8 sm:w-10 sm:h-10 text-white bg-primary rounded-full shadow-lg hover:scale-125 transition linear duration-150">
					<ChevronRightIcon className="h-5 sm:h-7" />
				</button>
			</div>
		</>
	);
};

export default StoriesButtons;
