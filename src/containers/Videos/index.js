import { Helmet } from "react-helmet";
import Navbar from "../../components/Navbar";

const Videos = () => {
  return (
    <div className="bg-gray-200 min-h-screen">
      <Helmet>
        <title>Videos || FaceGram</title>
      </Helmet>
      <Navbar />
      <div class="w-full h-60 flex justify-center items-center">
        <div className="text-lg">Videos</div>
      </div>
    </div>
  );
};

export default Videos;
