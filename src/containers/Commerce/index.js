import { Helmet } from "react-helmet";
import Navbar from "../../components/Navbar";

const Commerce = () => {
	return (
		<div className="bg-gray-200 min-h-screen">
			<Helmet>
				<title>Commerce || FaceGram</title>
			</Helmet>
			<Navbar />
			<div class="w-full h-60 flex justify-center items-center">
				<div className="text-lg">Commerce</div>
			</div>
		</div>
	);
};

export default Commerce;
