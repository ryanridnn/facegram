import { Link, useLocation } from "react-router-dom";

// icons
import {
	HomeIcon as HomeIconSolid,
	VideoCameraIcon as VideoCameraIconSolid,
	ShoppingCartIcon as ShoppingCartIconSolid,
	UserGroupIcon as UserGroupIconSolid,
} from "@heroicons/react/solid";
import {
	HomeIcon as HomeIconOutline,
	VideoCameraIcon as VideoCameraIconOutline,
	ShoppingCartIcon as ShoppingCartIconOutline,
	UserGroupIcon as UserGroupIconOutline,
} from "@heroicons/react/outline";

const BottomNav = () => {
	const location = useLocation();
	const path = location.pathname;

	return (
		<div className="fixed bottom-0 left-0 w-full bg-white z-20 shadow-lg sm:hidden rounded-t-2xl">
			<nav className="h-16 w-full flex items-center">
				<ul className="h-full w-full flex items-center">
					<li className="h-full flex-1">
						<Link
							to="/"
							className="h-full flex justify-center items-center"
						>
							{path === "/" ? (
								<HomeIconSolid className="h-7 text-primary" />
							) : (
								<HomeIconOutline className="h-7" />
							)}
						</Link>
					</li>
					<li className="h-full flex-1">
						<Link
							to="/videos"
							className="h-full flex justify-center items-center"
						>
							{path === "/videos" ? (
								<VideoCameraIconSolid className="h-7 text-primary" />
							) : (
								<VideoCameraIconOutline className="h-7" />
							)}
						</Link>
					</li>
					<li className="h-full flex-1">
						<Link
							to="/commerce"
							className="h-full flex justify-center items-center"
						>
							{path === "/commerce" ? (
								<ShoppingCartIconSolid className="h-7 text-primary" />
							) : (
								<ShoppingCartIconOutline className="h-7" />
							)}
						</Link>
					</li>
					<li className="h-full flex-1">
						<Link
							to="/group"
							className="h-full flex justify-center items-center"
						>
							{path === "/group" ? (
								<UserGroupIconSolid className="h-7 text-primary" />
							) : (
								<UserGroupIconOutline className="h-7" />
							)}
						</Link>
					</li>
				</ul>
			</nav>
		</div>
	);
};

export default BottomNav;
