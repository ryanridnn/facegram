import { useState, useRef, useEffect } from "react";
import { useSwiper } from "swiper/react";

//components
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PulseLoader from "react-spinners/PulseLoader";

// icons
import {
	VolumeOffIcon,
	AnnotationIcon,
	DotsHorizontalIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from "@heroicons/react/outline";

const storyDuration = 5000;

const Story = ({
	active = false,
	story: { id, user, media, postedAt },
	progress,
	storiesLength,
	addSeenStories,
}) => {
	const [currentStory, setCurrentStory] = useState(media[0]);
	const [cardHover, setCardHover] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const storyIndexRef = useRef(0);

	const parentRef = useRef();

	const swiper = useSwiper();

	const nextStory = () => {
		if (storyIndexRef.current === media.length - 1) {
			addSeenStories(id);
			swiper.slideNext();
			return;
		}

		storyIndexRef.current += 1;
		setCurrentStory(media[storyIndexRef.current]);
	};

	const prevStory = () => {
		if (storyIndexRef.current === 0) {
			if (media.length === 1) addSeenStories(id);
			swiper.slidePrev();
			return;
		}

		storyIndexRef.current -= 1;
		setCurrentStory(media[storyIndexRef.current]);
	};

	useEffect(() => {
		if (active) {
			storyIndexRef.current = 0;
			setCurrentStory(media[0]);
		}
	}, [active]);

	useEffect(() => {
		if (!active || !loaded) return;

		const timeout = setTimeout(() => {
			nextStory();
		}, storyDuration);

		return () => clearTimeout(timeout);
	}, [currentStory, active, loaded]);

	return (
		<motion.div
			initial={{ scale: 0.85 }}
			animate={{
				scale: active ? 1 : 0.85,
				transition: { duration: 0.4 },
			}}
			onMouseOver={() => setCardHover(true)}
			onMouseLeave={() => setCardHover(false)}
			className="rounded-2xl relative text-white story-size select-none overflow-hidden"
			ref={parentRef}
		>
			{active && (
				<NavButtons
					cardHover={cardHover}
					nextStory={nextStory}
					prevStory={prevStory}
					progress={progress}
					storyProgress={storyIndexRef.current / (media.length - 1)}
					storiesLength={storiesLength}
				/>
			)}

			{active ? (
				<ActiveLayout {...{ ...user, media, storyIndexRef, loaded }} />
			) : (
				<InactiveLayout
					fullname={user.fullname}
					photoURL={user.photoURL}
				/>
			)}

			{active && !loaded && (
				<div className="h-full w-full absolute flex justify-center items-center">
					<PulseLoader color={"#FFF"} />
				</div>
			)}

			<LazyLoadImage
				className="h-full rounded-2xl"
				height={parentRef.current?.offsetHeight}
				src={currentStory.photo}
				key={currentStory.photo}
				alt="Story"
				effect="opacity"
				beforeLoad={(e) => setLoaded(false)}
				afterLoad={(e) => setLoaded(true)}
			/>
		</motion.div>
	);
};

const ActiveLayout = ({
	id,
	fullname,
	photoURL,
	media,
	storyIndexRef,
	loaded,
}) => {
	return (
		<>
			<div className="absolute h-full w-full top-0 left-0 story-shadow"></div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { duration: 0.6 } }}
				exit={{ opacity: 1, transition: { duration: 0.6 } }}
				className="absolute top-0 left-0 w-full px-4 py-3 z-20"
			>
				<div className="flex gap-1">
					{media.map((story, i) => (
						<div
							key={i}
							className="flex-1 h-1 bg-[#FFFFFFAA] rounded-full"
						>
							{i <= storyIndexRef.current &&
								(i === storyIndexRef.current ? (
									loaded ? (
										<motion.div
											initial={{
												scaleX: 0,
											}}
											animate={{
												scaleX: 1,
												transition: {
													duration:
														storyDuration / 1000,
													ease: [0, 0, 1, 1],
												},
											}}
											className="w-full h-full bg-white origin-top-left"
										></motion.div>
									) : (
										<div className="h-full bg-white scale-x-0"></div>
									)
								) : (
									<div className="w-full h-full bg-white"></div>
								))}
						</div>
					))}
				</div>
				<div className="flex justify-between items-center py-3">
					<motion.div
						whileHover={{
							scale: 1.1,
							transition: { duration: 0.15 },
						}}
						className="flex gap-2 items-center"
					>
						<Link
							to={"profile/" + id}
							className="h-8 w-8 rounded-full overflow-hidden"
						>
							<img src={photoURL} alt="Profile Pic" />
						</Link>
						<Link
							to={"/profile/" + id}
							className="font-semibold text-sm"
						>
							{fullname}
						</Link>
					</motion.div>
					<div className="flex gap-4">
						<motion.button
							whileHover={{
								scale: 1.2,
								transition: { duration: 0.15 },
							}}
						>
							<VolumeOffIcon className="h-6" />
						</motion.button>
						<motion.button
							whileHover={{
								scale: 1.2,
								transition: { duration: 0.15 },
							}}
						>
							<AnnotationIcon className="h-6" />
						</motion.button>
						<motion.button
							whileHover={{
								scale: 1.2,
								transition: { duration: 0.15 },
							}}
						>
							<DotsHorizontalIcon className="h-6" />
						</motion.button>
					</div>
				</div>
			</motion.div>
		</>
	);
};

const InactiveLayout = ({ fullname, photoURL }) => {
	return (
		<>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.4, transition: { duration: 0.6 } }}
				className="w-full h-full absolute top-0 left-0 bg-black opacity-40"
			></motion.div>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { duration: 0.6 } }}
				exit={{ opacity: 0, transition: { duration: 0.6 } }}
				className="absolute top-0 left-0 h-full w-full flex flex-col justify-center items-center gap-2"
			>
				<div className="flex justify-center items-center h-28 w-28 rounded-full border-4 border-[#E56363] z-20">
					<img
						src={photoURL}
						className="h-24 w-24 rounded-full"
						alt="Profile Pic"
					/>
				</div>
				<div className="font-semibold text-lg z-20">{fullname}</div>
			</motion.div>
		</>
	);
};

const NavButtons = ({
	cardHover,
	nextStory,
	prevStory,
	progress,
	storyProgress,
	storiesLength,
}) => {
	const [buttonOpacity, setButtonOpacity] = useState(0);

	useEffect(() => {
		if (cardHover) setButtonOpacity(0.7);
		else setButtonOpacity(0);
	}, [cardHover]);

	return (
		<>
			{storiesLength === 1 ? (
				""
			) : progress === 0 && storyProgress === 0 ? (
				""
			) : (
				<motion.button
					onClick={prevStory}
					initial={{ opacity: 0 }}
					animate={{
						opacity: buttonOpacity,
						transition: { duration: 0.15 },
					}}
					whileHover={{
						opacity: 1,
						transition: { duration: 0.15 },
					}}
					className="h-12 w-12 rounded-full bg-white absolute top-1/2 -translate-y-1/2 left-2 flex justify-center items-center z-30"
				>
					<ChevronLeftIcon className="h-6 w-6 text-black" />
				</motion.button>
			)}
			{progress === 1 && storyProgress === 1 ? (
				""
			) : (
				<motion.button
					onClick={nextStory}
					initial={{ opacity: 0 }}
					animate={{
						opacity: buttonOpacity,
						transition: { duration: 0.15 },
					}}
					whileHover={{ opacity: 1, transition: { duration: 0.15 } }}
					className="h-12 w-12 rounded-full bg-white absolute top-1/2 -translate-y-1/2 right-2 flex justify-center items-center z-30"
				>
					<ChevronRightIcon className="h-6 w-6 text-black" />
				</motion.button>
			)}
		</>
	);
};

export default Story;
