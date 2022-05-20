import { useState, useEffect, useRef } from "react";
import {
	onSnapshot,
	collection,
	collectionGroup,
	query,
	orderBy,
	limit,
	startAfter,
	getDoc,
	getDocs,
	setDoc,
	addDoc,
	updateDoc,
	deleteDoc,
	doc,
	increment,
	serverTimestamp,
	where,
} from "firebase/firestore";

import {
	ref,
	uploadBytes,
	getDownloadURL,
	deleteObject,
} from "firebase/storage";

import { db, auth, storage } from "../../firebase/config";
import { v4 } from "uuid";

import { useDispatch, useSelector } from "react-redux";
import {
	addPostToSelectedUser,
	removePostFromSelectedUser,
} from "../reducers/userSlice";
import {
	setPosts,
	addCommentsCollection,
	addComment,
	deleteComment as deleteCommentAction,
} from "../reducers/postsSlice";

import { getSnapshotData } from "../../../utils";

export const usePostsColListener = () => {
	const { posts } = useSelector((state) => state.posts);
	const [loading, setLoading] = useState(true);
	const dispatch = useDispatch();

	useEffect(() => {
		const unsub = onSnapshot(
			query(collectionGroup(db, "posts"), orderBy("postedAt", "desc")),
			async (snapshot) => {
				const postsData = getSnapshotData(snapshot).map((doc) => ({
					...doc,
					comments: [],
				}));

				dispatch(setPosts(postsData));
				setLoading(false);
			}
		);

		return unsub;
	}, []);

	return { posts, loading };
};

export const fetchComments = async (userId, postId, dispatch) => {
	const commentsRef = collection(
		db,
		"users",
		userId,
		"posts",
		postId,
		"comments"
	);

	const querySnapshot = await getDocs(
		query(commentsRef, orderBy("postedAt", "desc"))
	);

	const comments = getSnapshotData(querySnapshot);

	dispatch(addCommentsCollection({ postId, comments: { postId, comments } }));
};

export const sendComment = async (text, userId, postId, dispatch) => {
	const { uid, displayName, photoURL } = auth.currentUser;

	const commentRef = collection(
		db,
		"users",
		userId,
		"posts",
		postId,
		"comments"
	);

	const postRef = doc(db, "users", userId, "posts", postId);

	const comment = {
		likes: 0,
		text,
		postedAt: serverTimestamp(),
		user: {
			id: uid,
			fullname: displayName,
			photoURL,
		},
		postId: postId,
	};

	await addDoc(commentRef, comment);

	await updateDoc(postRef, {
		"stats.comments": increment(1),
	});

	comment.postedAt = new Date();

	dispatch(addComment({ postId, comment }));
};

export const deleteComment = async (ids, dispatch) => {
	const commentRef = doc(
		db,
		"users",
		ids.userId,
		"posts",
		ids.postId,
		"comments",
		ids.commentId
	);

	const postRef = doc(db, "users", ids.userId, "posts", ids.postId);

	await deleteDoc(commentRef);

	await updateDoc(postRef, {
		"stats.comments": increment(-1),
	});

	dispatch(
		deleteCommentAction({ postId: ids.postId, commentId: ids.commentId })
	);
};

export const useLikeListener = (ids) => {
	const likeRef = doc(
		db,
		"users",
		ids.posterId,
		"posts",
		ids.postId,
		"likes",
		ids.userId
	);

	const getHasLiked = async () => {
		const docSnap = await getDoc(likeRef);

		return docSnap.exists();
	};

	const [hasLiked, setHasLiked] = useState(async () => await getHasLiked());

	useEffect(() => {
		const unsub = onSnapshot(likeRef, (doc) => {
			setHasLiked(doc.exists());
		});

		return unsub;
	}, []);

	return hasLiked;
};

export const likePost = async (ids, liked, setLikeLoading) => {
	setLikeLoading(true);

	const likeRef = doc(
		db,
		"users",
		ids.posterId,
		"posts",
		ids.postId,
		"likes",
		ids.userId
	);

	const postRef = doc(db, "users", ids.posterId, "posts", ids.postId);

	if (!liked) {
		await setDoc(likeRef, {
			userId: ids.userId,
		});
		await updateDoc(postRef, { "stats.likes": increment(1) });
	} else {
		await deleteDoc(likeRef);
		await updateDoc(postRef, { "stats.likes": increment(-1) });
	}
	setLikeLoading(false);
};

export const useSavedListener = (ids) => {
	const savedPostRef = doc(
		db,
		"users",
		ids.userId,
		"saved_posts",
		ids.postId
	);

	const getHasSaved = async (ids) => {
		const docSnap = await getDoc(savedPostRef);

		return docSnap.exists();
	};

	const [hasSaved, setHasSaved] = useState(
		async () => await getHasSaved(ids)
	);

	useEffect(() => {
		const unsub = onSnapshot(savedPostRef, (doc) => {
			setHasSaved(doc.exists());
		});

		return unsub;
	}, []);

	return hasSaved;
};

export const savePost = async (ids, saved, setSaveLoading) => {
	setSaveLoading(true);

	const savedPostRef = doc(
		db,
		"users",
		ids.userId,
		"saved_posts",
		ids.postId
	);

	const postRef = doc(db, "users", ids.posterId, "posts", ids.postId);

	if (!saved) {
		await setDoc(savedPostRef, {
			posterId: ids.posterId,
			postId: ids.postId,
		});

		await updateDoc(postRef, { "stats.saves": increment(1) });
	} else {
		await deleteDoc(savedPostRef);
		await updateDoc(postRef, { "stats.saves": increment(-1) });
	}
	setSaveLoading(false);
};

export const uploadPost = async (media, obj, dispatch) => {
	const { uid: id, displayName: fullname, photoURL } = auth.currentUser;

	obj = {
		desc: obj.desc,
		postedAt: serverTimestamp(),
		user: { id, fullname, photoURL },
		stats: { likes: 0, saves: 0, comments: 0 },
	};

	const promises = [];
	const uploadedMedia = [];

	const uploadPostData = async () => {
		obj.media = uploadedMedia;
		const docSnap = await addDoc(
			collection(db, "users", obj.user.id, "posts"),
			obj
		);
		dispatch(
			addPostToSelectedUser([
				{ id: docSnap.id, ...obj, postedAt: new Date() },
			])
		);
	};

	if (media.length === 0) await uploadPostData();

	media.forEach(async (m) => {
		promises.push(
			new Promise(async (resolve, reject) => {
				const imageRef = ref(storage, `images/${v4()}`);
				const imgSnap = await uploadBytes(imageRef, m);
				const downloadURL = await getDownloadURL(imgSnap.ref);

				uploadedMedia.push({
					photo: downloadURL,
					path: imgSnap.ref._location.path_,
				});
				if (uploadedMedia.length === media.length)
					await uploadPostData();

				resolve();
			})
		);
	});

	await Promise.all(promises);
	await updateDoc(doc(db, "users", id), { "stats.posts": increment(1) });
};

export const deletePost = async (id, selectedUserId, dispatch) => {
	const { uid } = auth.currentUser;

	const postRef = doc(db, "users", uid, "posts", id);
	const postSnap = await getDoc(postRef);
	const post = postSnap.data();

	const deletePostData = async () => {
		const savedPosts = await getDocs(
			query(
				collectionGroup(db, "saved_posts"),
				where("postId", "==", "id")
			)
		);
		savedPosts.docs.forEach((savedPost) => {
			deleteDoc(savedPost.ref);
		});

		const likesSnap = await getDocs(
			collection(db, "users", post.user.id, "posts", id, "likes")
		);

		likesSnap.docs.forEach((like) => {
			deleteDoc(like.ref);
		});

		const commentsSnap = await getDocs(
			collection(db, "users", post.user.id, "posts", id, "comments")
		);
		commentsSnap.docs.forEach((comment) => {
			deleteDoc(comment.ref);
		});

		await deleteDoc(postRef);
		await updateDoc(doc(db, "users", uid), {
			"stats.posts": increment(-1),
		});
		if (selectedUserId) {
			dispatch(removePostFromSelectedUser(id));
		}
	};

	if (post.media.length === 0) return await deletePostData();

	let completedDeletion = 0;
	let promises = [];

	post.media.map((m) => {
		promises.push(
			new Promise(async (resolve, reject) => {
				await deleteObject(ref(storage, m.path));
				completedDeletion += 1;
				if (post.media.length === completedDeletion)
					await deletePostData();
			})
		);
	});

	await Promise.all(promises);
	await deletePostData();
};

export const useFetchPost = (id) => {
	const dispatch = useDispatch();

	// const [posts, setPosts] = useState([]);
	const { posts } = useSelector((state) => state.user.selectedUser);
	const [loading, setLoading] = useState(true);
	const noMorePostRef = useRef();
	const lastPostRef = useRef();

	const fetchLimit = 5;

	const fetchQuery = async (q) => {
		if (noMorePostRef.current) return;

		setLoading(true);
		const docsSnap = await getDocs(q);
		const data = getSnapshotData(docsSnap);

		if (data.length < fetchLimit) noMorePostRef.current = true;

		lastPostRef.current = docsSnap.docs[data.length - 1];
		// setPosts((prevData) => [...prevData, ...data]);
		dispatch(addPostToSelectedUser(data));
		setLoading(false);
	};

	const next = () => {
		if (noMorePostRef.current) return;

		const q = query(
			collection(db, "users", id, "posts"),
			orderBy("postedAt", "desc"),
			startAfter(lastPostRef.current),
			limit(fetchLimit)
		);
		fetchQuery(q);
	};

	useEffect(() => {
		noMorePostRef.current = false;

		const q = query(
			collection(db, "users", id, "posts"),
			orderBy("postedAt", "desc"),
			limit(fetchLimit)
		);

		fetchQuery(q);
	}, [id]);

	return {
		posts,
		next,
		loading,
		noMorePost: noMorePostRef.current,
	};
};
