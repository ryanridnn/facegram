import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PrivateRoute() {
	const { currentUser } = useSelector((state) => state.user);

	return currentUser && currentUser.name ? (
		<Outlet />
	) : (
		<Navigate to="/login" />
	);
}

export default PrivateRoute;
