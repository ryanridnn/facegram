import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

// components
import PostFormModal from "../PostFormModal";

// icons
import { CameraIcon } from "@heroicons/react/outline";

const PostForm = ({ className }) => {
	const { currentUser } = useSelector((state) => state.user);
	const [modalOpened, setModalOpened] = useState(false);

	return (
		<div
			className={
				"text-sm sm:text-base flex bg-white rounded-xl shadow p-4 sm:p-5 " +
				className
			}
		>
			<Link
				to={process.env.PUBLIC_URL + "/profile/" + currentUser.id}
				className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 mr-3 overflow-hidden"
			>
				<img src={currentUser.photoURL} alt="User Profile Pic" />
			</Link>
			<div className="flex-1 flex justify-between rounded-full bg-gray-200">
				<button
					onClick={() => setModalOpened(true)}
					type="text"
					className="flex-1 bg-transparent px-4 sm:px-6 text-[#555555] focus:outline-0 text-left"
				>
					Whats'up today?
				</button>
				<motion.label
					onClick={() => setModalOpened(true)}
					htmlFor="file-input"
					whileHover={{ scale: 1.15, transition: { duration: 0.15 } }}
					className="flex justify-center items-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary cursor-pointer"
				>
					<CameraIcon className="h-5 text-white" />
				</motion.label>
			</div>
			<PostFormModal
				modalOpened={modalOpened}
				setModalOpened={setModalOpened}
			/>
		</div>
	);
};

export default PostForm;
