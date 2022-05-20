import { useSelector } from "react-redux";
import { useEffect } from "react";

/// listener hooks
import { usePostsColListener } from "../../services/store/actions/postsActions";

// components
import { Helmet } from "react-helmet";
import Navbar from "../../components/Navbar";
import Container from "../../components/Container";
import StoryCirclesCarousel from "../../components/StoryCirclesCarousel";
import Stories from "../../components/Stories";
import PostForm from "../../components/PostForm";
import PostCard from "../../components/PostCard";
import PulseLoader from "react-spinners/PulseLoader";

const Home = () => {
	const { posts, loading } = usePostsColListener();
	const { selectedStoryIndex } = useSelector((state) => state.stories);

	return (
		<div className="bg-gray-200 min-h-screen">
			<Helmet>
				<title>Home || FaceGram</title>
			</Helmet>
			<Navbar />
			<Container>
				<StoryCirclesCarousel className="mt-0 md:mt-8 z-0" />
				<PostForm className="mt-3 sm:mt-5" />
				<div className="flex flex-col gap-4 sm:gap-6 mt-3 sm:mt-5 pb-24 sm:pb-10">
					{loading ? (
						<div className="flex justify-center mt-10">
							<PulseLoader color={"#555"} />
						</div>
					) : (
						posts.map((post) => (
							<PostCard key={post.id} {...post} />
						))
					)}
				</div>
			</Container>
			{selectedStoryIndex !== null && <Stories />}
		</div>
	);
};

export default Home;
