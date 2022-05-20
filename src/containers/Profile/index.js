import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";

import { Helmet } from "react-helmet";
import Navbar from "../../components/Navbar";
import Container from "../../components/Container";
import PostCard from "../../components/PostCard";
import { getUserData } from "../../services/store/actions/userActions";
import { auth } from "../../services/firebase/config";
import { PulseLoader } from "react-spinners";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { PlusCircleIcon, PencilIcon } from "@heroicons/react/outline";
import { motion } from "framer-motion";
import PostFormModal from "../../components/PostFormModal/";
import UpdateProfileModal from "../../components/UpdateProfileModal/";

import { useFetchPost } from "../../services/store/actions/postsActions";
import {
	clearPostFromSelectedUser,
	setSelectedUser,
} from "../../services/store/reducers/userSlice";

function Profile() {
	const dispatch = useDispatch();
	const { id } = useParams();
	const userId = auth.currentUser.uid;

	const [user, setUser] = useState({});
	const [loadingUser, setLoadingUser] = useState(true);
	const [notFound, setNotFound] = useState(false);

	const { posts, next, loading, noMorePost } = useFetchPost(id);

	const [postFormOpened, setPostFormOpened] = useState(false);
	const [updateFormOpened, setUpdateFormOpened] = useState(false);

	const observerRef = useRef();
	const [loaderInView, setLoaderInView] = useState(false);
	const loaderRef = useRef();

	useEffect(() => {
		dispatch(clearPostFromSelectedUser());
		setLoadingUser(true);
		const unsub = getUserData(id, (res) => {
			setUser(res);
			setLoadingUser(false);
		});

		return unsub;
	}, [id]);

	useEffect(() => {
		if (!loadingUser) {
			dispatch(setSelectedUser({ posts: [], ...user }));
			observerRef.current = new IntersectionObserver((entries) => {
				const loader = entries[0];

				setLoaderInView(loader.isIntersecting);
			});

			if (loaderRef.current)
				observerRef.current.observe(loaderRef.current);
		}
	}, [loadingUser]);

	useEffect(() => {
		if (loaderInView && !loadingUser && !loading && !noMorePost) {
			next();
		}
	}, [loaderInView]);

	return (
		<div className="bg-gray-200 min-h-screen">
			<Helmet>
				<title>User Profile || FaceGram</title>
			</Helmet>
			<Navbar />
			{!loadingUser && (
				<Container>
					<div className="w-full h-full bg-white mt-4 sm:mt-8 rounded-lg overflow-hidden">
						<div className="pt-8 pb-14 flex flex-col items-center items-center">
							<div className="flex flex-col items-center">
								<div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden bg-gray-50">
									<LazyLoadImage
										height={
											window.innerWidth <= 640
												? 24 * 4
												: 28 * 4
										}
										src={user.photoURL}
										className="w-full"
										effect="opacity"
										style={{
											height: "100%",
											width: "100%",
										}}
									/>
								</div>
								{userId !== user.id && (
									<motion.button
										whileHover={{
											scale: 0.94,
											transition: { duration: 0.15 },
										}}
										className="py-2 px-6 rounded text-primary bg-blue-100 font-medium -mt-3"
									>
										Follow
									</motion.button>
								)}
							</div>
							<h1 className="mt-5 font-semibold text-xl sm:text-2xl">
								{user.fullname}
							</h1>
							{user.bio && user.status && user.link && (
								<>
									{" "}
									<div className="text-gray-600 text-sm sm:text-base">
										{user.status}
									</div>
									<div className="mt-3 text-gray-600 text-center px-10 text-sm sm:text-base">
										{user.bio}
									</div>
									<motion.a
										whileHover={{
											scale: 0.94,
											transition: { duration: 0.15 },
										}}
										href={user.link ? user.link : "#"}
										target="_blank"
										className="mt-6 text-blue-600 text-sm sm:text-base"
									>
										{user.link}
									</motion.a>{" "}
								</>
							)}
						</div>
						<div className="flex justify-between items-center mx-6 border-b-2 border-gray-200">
							{id === auth.currentUser.uid && (
								<div className="flex gap-4 py-4">
									<motion.button
										whileHover={{
											scale: 1.2,
											transition: { duration: 0.15 },
										}}
										onClick={() => setPostFormOpened(true)}
									>
										<PlusCircleIcon className="h-6 sm:h-7 text-primary" />
									</motion.button>
									<motion.button
										whileHover={{
											scale: 1.2,
											transition: { duration: 0.15 },
										}}
										onClick={() => {
											setUpdateFormOpened(true);
										}}
									>
										<PencilIcon className="h-6 sm:h-7 text-primary" />
									</motion.button>
								</div>
							)}

							<div
								className={`flex gap-5 ${
									id !== auth.currentUser.uid &&
									"w-full mb-6 justify-center"
								}`}
							>
								<div className="text-sm sm:text-base">
									<span className="font-semibold mr-1">
										{user.stats?.posts}
									</span>
									{user.stats?.posts > 1 ? "Posts" : "Post"}
								</div>
								<div className="text-sm sm:text-base">
									<span className="font-semibold mr-1">
										{user.stats?.following}
									</span>
									{user.stats?.following > 1
										? "Followings"
										: "Following"}
								</div>
								<div className="text-sm sm:text-base">
									<span className="font-semibold mr-1">
										{user.stats?.followers}
									</span>
									{user.stats?.followers > 1
										? "Followers"
										: "Follower"}
								</div>
							</div>
						</div>
					</div>

					<div className="flex flex-col gap-6 mt-5 pb-10">
						{posts.map((post, i) => (
							<PostCard key={post.id} {...post} />
						))}
						{noMorePost ? (
							<div className="flex justify-center items-center my-4">
								{posts.length === 0
									? "No posts yet."
									: "No more posts."}
							</div>
						) : (
							<div
								ref={loaderRef}
								className="flex justify-center items-center my-4"
							>
								<PulseLoader color="#555" />
							</div>
						)}
					</div>
				</Container>
			)}
			{loadingUser && (
				<div className="w-full min-h-screen flex justify-center items-center">
					<PulseLoader color="#555" />
				</div>
			)}
			<div className="h-14 sm:h-0"></div>
			<PostFormModal
				modalOpened={postFormOpened}
				setModalOpened={setPostFormOpened}
			/>
			<UpdateProfileModal
				selectedUser={user}
				modalOpened={updateFormOpened}
				setModalOpened={setUpdateFormOpened}
			/>
		</div>
	);
}

export default Profile;
