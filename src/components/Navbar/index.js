import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

import { firebaseLogout } from "../../services/store/actions/userActions";

// component
import Nav from "./Nav";
import BottomNav from "./BottomNav";
import ActionListPopup from "../ActionListPopup";

import { UserIcon, LogoutIcon } from "@heroicons/react/outline";

// assets
import { ReactComponent as Logo } from "../../assets/logo.svg";

const Navbar = () => {
	const { id, photoURL } = useSelector((state) => state.user.currentUser);
	const [popupOpened, setPopupOpened] = useState(false);

	const actionList = [
		{
			actionName: "Profile",
			icon: UserIcon,
			type: "navigate",
			path: "/profile/" + id,
		},
		{ actionName: "Logout", icon: LogoutIcon, handler: firebaseLogout },
	];

	return (
		<>
			<header>
				<div className="w-full px-4 py-3 sm:px-12 sm:py-0 flex justify-between items-center shadow bg-white sticky top-0 z-10">
					<Link to="/">
						<Logo className="h-8 w-8 sm:h-10 sm:w-10" />
					</Link>
					<Nav />
					<div className="relative">
						<motion.button
							onClick={() => setPopupOpened(!popupOpened)}
							whileHover={{
								scale: 0.94,
								transition: { duration: 0.15 },
							}}
							className="h-8 w-8 sm:h-10 sm:w-10 bg-gray-200 rounded-full overflow-hidden"
						>
							<img src={photoURL} alt="User Profile" />
						</motion.button>
						<ActionListPopup
							popupOpened={popupOpened}
							setPopupOpened={setPopupOpened}
							actionList={actionList}
						/>
					</div>
				</div>
				<BottomNav />
			</header>
		</>
	);
};

export default Navbar;
