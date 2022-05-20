import { useDispatch } from "react-redux";

import { selectStory } from "../../services/store/actions/storiesActions";

const StoryCircle = ({ id, user: { fullname, photoURL }, seen }) => {
	const dispatch = useDispatch();

	return (
		<div
			onClick={() => selectStory(id, dispatch)}
			className="flex flex-col items-center w-full cursor-pointer"
		>
			<div
				className={`flex justify-center items-center h-16 w-16 sm:h-20 sm:w-20 rounded-full border-4 hover:scale-95 transition linear duration-150 ${
					seen ? "border-gray-500" : "border-[#E56363]"
				}`}
			>
				<div className="w-12 h-12 sm:h-16 sm:w-16 rounded-full bg-primary overflow-hidden">
					<img src={photoURL} alt="Profile Pic" />
				</div>
			</div>
			<div className="w-full inline-block whitespace-nowrap overflow-hidden text-ellipsis mt-3 text-center text-[11px] sm:text-xs font-semibold">
				{fullname}
			</div>
		</div>
	);
};

export default StoryCircle;
