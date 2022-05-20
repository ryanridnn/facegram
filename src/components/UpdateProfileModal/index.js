import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

import Modal from "../Modal";
import PulseLoader from "react-spinners/PulseLoader";

import { updateUser } from "../../services/store/actions/userActions";
import { auth } from "../../services/firebase/config";

const UpdateProfileModal = ({ selectedUser, modalOpened, setModalOpened }) => {
	const { uid } = auth.currentUser;
	const [isUpdating, setIsUpdating] = useState(false);

	const statusRef = useRef();
	const bioRef = useRef();
	const linkRef = useRef();

	useEffect(() => {
		if (!modalOpened) return;

		statusRef.current.value = selectedUser.status || null;
		bioRef.current.value = selectedUser.bio || null;
		linkRef.current.value = selectedUser.link || null;
	}, [modalOpened, selectedUser]);

	const handleSubmit = async () => {
		if (
			statusRef.current.value.length === 0 ||
			bioRef.current.value.length === 0 ||
			linkRef.current.value.length === 0 ||
			bioRef.current.value.length > 285
		) {
			return;
		}

		setIsUpdating(true);
		await updateUser(uid, {
			status: statusRef.current.value,
			bio: bioRef.current.value,
			link: linkRef.current.value,
		});
		setIsUpdating(false);
		setModalOpened(false);
	};

	return (
		<Modal
			title="Update profile"
			modalOpened={modalOpened}
			setModalOpened={setModalOpened}
		>
			<div className="bg-gray-100 p-6 flex flex-col gap-6">
				<div className="flex flex-col gap-3">
					<label htmlFor="status-input">Status</label>
					<input
						type="text"
						placeholder="Status..."
						className="p-4 rounded-lg bg-white outline-none placeholder:text-[#555555]"
						id="status-input"
						ref={statusRef}
					/>
				</div>
				<div className="flex flex-col gap-3">
					<label htmlFor="bio-input">Bio</label>
					<textarea
						type="text"
						placeholder="Bio..."
						className="p-4 rounded-lg bg-white outline-none resize-none h-28 placeholder:text-[#555555]"
						id="bio-input"
						ref={bioRef}
					/>
				</div>
				<div className="flex flex-col gap-3">
					<label htmlFor="link-input">Link</label>
					<input
						type="text"
						placeholder="Link..."
						className="p-4 rounded-lg bg-white outline-none text-blue-600 placeholder:text-[#555555]"
						id="link-input"
						ref={linkRef}
					/>
				</div>
			</div>
			<div className="px-6 py-5">
				<motion.button
					whileHover={{
						scale: 0.98,
						transition: { duration: 0.15 },
					}}
					className="w-full bg-primary p-4 text-md text-white font-semibold rounded-lg"
					onClick={handleSubmit}
				>
					{isUpdating ? (
						<PulseLoader size={10} color={"#fff"} />
					) : (
						"Update"
					)}
				</motion.button>
			</div>
		</Modal>
	);
};

export default UpdateProfileModal;
