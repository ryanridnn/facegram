import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { firebaseLogin } from "../../services/store/actions/userActions";

// icon
import { ReactComponent as Logo } from "../../assets/logo.svg";
import { ReactComponent as GoogleLogo } from "../../assets/google.svg";

// assets
import { Helmet } from "react-helmet";
import LoginPict from "../../assets/login-pict.jpg";

const Login = () => {
	const navigate = useNavigate();
	const { currentUser } = useSelector((state) => state.user);

	useEffect(() => {
		if (currentUser && currentUser.name) {
			navigate("/");
		}
	}, [currentUser]);

	return (
		<div className="h-screen w-full flex flex-col justify-center items-center bg-gray-100">
			<Helmet>
				<title>Login || FaceGram</title>
			</Helmet>
			<div className="bg-white flex flex-col w-full h-full sm:w-auto sm:h-auto sm:rounded-2xl overflow-hidden">
				<div className="flex-1 sm:flex-none max-w-full sm:w-[660px] h-56 relative">
					<div className="absolute top-0.5 left-0.5 m-4 bg-white p-3 pr-4 flex rounded-full">
						<Logo className="h-7" />
						<span className="font-semibold ml-2 text-lg">
							FaceGram
						</span>
					</div>
					<img
						src={LoginPict}
						className="w-full h-full"
						alt="login pict"
					/>
				</div>
				<div className="p-10 flex flex-col">
					<h1 className="font-bold text-3xl sm:text-5xl mt-4 sm:mt-0 mb-6 sm:mb-4">
						<span className="text-5xl">Hello 👋</span>
						<span className="block mt-2 sm:inline sm:mt-0 text-slate-600 sm:text-black sm:ml-4">
							Login to continue
						</span>
					</h1>
					<p className="mb-8 sm:mb-10 text-gray-900">
						In order to continue your journey, login to your google
						account.
					</p>
					<motion.button
						onClick={firebaseLogin}
						whileHover={{
							scale: 0.98,
							transition: { duration: 0.15 },
						}}
						className="bg-primary p-5 sm:p-6 h-full text-medium flex justify-center items-center gap-4 text-white rounded-md"
					>
						<GoogleLogo className="h-7" fill="white" />
						<div className="text-lg font-medium">
							Login with Google
						</div>
					</motion.button>
				</div>
			</div>
		</div>
	);
};

export default Login;
