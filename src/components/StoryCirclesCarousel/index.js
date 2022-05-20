import { useState } from "react";
import { Swiper, SwiperSlide as Slide } from "swiper/react";

// components
// import AddStoryCircle from "./AddStoryCircle";
import StoryCircle from "./StoryCircle";
import StoriesButtons from "./StoriesButtons";
import PulseLoader from "react-spinners/PulseLoader";

import { useStoriesColListener } from "../../services/store/actions/storiesActions";
import "swiper/css";

const minStoriesToScroll = 5;

const StoryCircleCarousel = ({ className }) => {
	const { stories, loading } = useStoriesColListener();
	const [progress, setProgress] = useState(0);

	return (
		<div className={className}>
			<Swiper
				className="user-with-story relative mt-4 sm:mt-6 flex gap-8 select-none z-0"
				spaceBetween={28}
				slidesPerView={"auto"}
				navigation={{ nextEl: ".slide-next", prevEl: ".slide-prev" }}
				watchSlidesProgress
				onProgress={(swiper, progress) => {
					setProgress(progress);
				}}
				centeredSlides={loading}
			>
				{loading && (
					<Slide className="flex h-[108px] w-full justify-center items-center">
						<PulseLoader color={"#555"} />
					</Slide>
				)}
				{!loading && stories.length > minStoriesToScroll && (
					<StoriesButtons progress={progress} />
				)}
				{!loading &&
					stories.map(({ id, user, media, seen }, i) => (
						<Slide key={i}>
							<StoryCircle id={id} user={user} seen={seen} />
						</Slide>
					))}
			</Swiper>
		</div>
	);
};

export default StoryCircleCarousel;
