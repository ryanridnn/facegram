// icon
import { PlusIcon } from "@heroicons/react/solid";

const AddStoryCircle = () => {
	return (
		<div className="flex flex-col items-center cursor-pointer">
			<div className="flex justify-center items-center h-20 w-20 rounded-full bg-primary hover:scale-95 transition linear duration-150">
				<PlusIcon className="h-10 text-white" />
			</div>
			<div className="mt-3 text-center text-xs font-semibold">
				Add a Story
			</div>
		</div>
	);
};

export default AddStoryCircle;
