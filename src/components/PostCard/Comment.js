import { useState } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";

import { auth } from "../../services/firebase/config";

import PulseLoader from "react-spinners/PulseLoader";
import Modal from "../Modal";

import { deleteComment } from "../../services/store/actions/postsActions";

import { calculateTimespan } from "../../utils";

// icons
import {
	HeartIcon as HeartIconSolid,
	DotsHorizontalIcon,
} from "@heroicons/react/solid";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/outline";

const Comment = ({
	posterId,
	id: commentId,
	variants,
	text,
	postedAt,
	likes,
	user: { fullname, id, photoURL },
	postId,
}) => {
	const dispatch = useDispatch();
	const [liked, setLiked] = useState(false);
	const [modalOpened, setModalOpened] = useState(false);
	const [isActionLoading, setIsActionLoading] = useState(false);

	const handleLikeClick = () => {
		setLiked(!liked);
	};

	const handleDeleteComment = async () => {
		if (id !== auth.currentUser.uid) return;

		setIsActionLoading(true);
		await deleteComment({ userId: posterId, postId, commentId }, dispatch);
		setIsActionLoading(false);
		setModalOpened(false);
	};

	return (
		<motion.div variants={variants} className="flex gap-4 px-3 sm:px-0">
			<div className="">
				<div className="w-7 h-7 rounded-full bg-primary overflow-hidden">
					<img src={photoURL} alt="profile pic" className="w-full" />
				</div>
			</div>
			<div className="flex-1">
				<div className="flex items-center text-sm font-semibold">
					{fullname}
				</div>
				<div className="mt-1.5 sm:mt-2">{text}</div>
				<div className="flex gap-2 mt-1.5 sm:mt-2 text-[10px] sm:text-xs">
					<div className="">{calculateTimespan(postedAt)}</div>
					<div className="">{likes} likes</div>
					<button className="">Reply</button>
					{id === auth.currentUser.uid && (
						<motion.button
							onClick={() => setModalOpened(true)}
							whileHover={{
								scale: 1.2,
								transition: { duration: 0.15 },
							}}
							className="ml-2"
						>
							<DotsHorizontalIcon className="h-4" />
						</motion.button>
					)}
				</div>
				<button className="mt-3 flex items-center gap-3">
					<div className="w-6 h-px bg-black"></div>
					<div className="text-xs">View Reply</div>
				</button>
			</div>
			<div className="flex items-center">
				<motion.button
					onClick={handleLikeClick}
					whileHover={{ scale: 1.13, transition: { duration: 0.15 } }}
				>
					{liked ? (
						<HeartIconSolid className="h-5 text-[#E56363]" />
					) : (
						<HeartIconOutline className="h-5" />
					)}
				</motion.button>
			</div>
			<Modal
				title="Comment Action"
				modalOpened={modalOpened}
				setModalOpened={setModalOpened}
			>
				<div className="bg-gray-200 p-6 flex flex-col gap-4">
					<motion.button
						onClick={handleDeleteComment}
						whileHover={{
							scale: 0.98,
							transition: { duration: 0.15 },
						}}
						className="w-full bg-red-500 p-4 text-md text-white font-semibold rounded-lg"
					>
						{isActionLoading ? (
							<PulseLoader color={"#fff"} />
						) : (
							"Delete"
						)}
					</motion.button>
					<motion.button
						onClick={() => setModalOpened(false)}
						whileHover={{
							scale: 0.98,
							transition: { duration: 0.15 },
						}}
						className="w-full bg-white p-4 text-md font-semibold rounded-lg"
					>
						Cancel
					</motion.button>
				</div>
			</Modal>
		</motion.div>
	);
};

export default Comment;
