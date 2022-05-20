import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";

import { selectStory } from "../../services/store/actions/storiesActions";

//components
import { Helmet } from "react-helmet";
import { Swiper, SwiperSlide as Slide } from "swiper/react";
import Story from "./Story";
import { ReactComponent as Logo } from "../../assets/logo.svg";

// icon
import { XIcon } from "@heroicons/react/solid";

import { setSeenToStory } from "../../services/store/actions/storiesActions";

const Stories = () => {
	const { stories } = useSelector((state) => state.stories);
	const [progress, setProgress] = useState(0);
	const seenStoriesRef = useRef([]);
	const headerBarRef = useRef();
	const dispatch = useDispatch();

	const { selectedStoryIndex } = useSelector((state) => state.stories);

	const addSeenStories = (id) => {
		seenStoriesRef.current.push(id);
	};

	const close = () => {
		seenStoriesRef.current.forEach((storyId) => {
			setSeenToStory(storyId, dispatch);
		});
		selectStory(null, dispatch);
	};

	return (
		<div className="fixed z-30 top-0 left-0 flex flex-col w-full h-full bg-slate-800 text-white">
			<Helmet>
				<title>Stories || FaceGram</title>
			</Helmet>
			<div
				ref={headerBarRef}
				className="flex justify-between items-center p-3 sm:p-6"
			>
				<motion.button
					onClick={close}
					whileHover={{ scale: 1.2, transition: { duration: 0.15 } }}
				>
					<Logo className="h-10 w-10 sm:h-12 sm:w-12 cursor-pointer" />
				</motion.button>
				<motion.button
					onClick={close}
					whileHover={{ scale: 1.2, transition: { duration: 0.15 } }}
					className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white flex justify-center items-center"
				>
					<XIcon className="h-6 sm:h-8 text-red-400" />
				</motion.button>
			</div>
			<div className="flex-1 h-full mt-6 sm:mt-0">
				<Swiper
					onProgress={(swiper, progress) => {
						setProgress(progress);
					}}
					centeredSlides={true}
					slidesPerView={"auto"}
					initialSlide={selectedStoryIndex}
					className="stories flex w-full h-full"
				>
					{stories &&
						stories.map((story, i) => (
							<Slide
								key={i}
								className="flex justify-center items-center"
							>
								{({ isActive }) => (
									<Story
										active={isActive}
										story={story}
										progress={progress}
										storiesLength={stories.length}
										addSeenStories={addSeenStories}
									/>
								)}
							</Slide>
						))}
				</Swiper>
			</div>
		</div>
	);
};

export default Stories;
