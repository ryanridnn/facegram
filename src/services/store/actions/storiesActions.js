import { useState, useEffect } from "react";
import { onSnapshot, collection } from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";

import { db } from "../../firebase/config";

import {
	setStories,
	selectStory as selectStoryAction,
	setSeenToStory as setSeenToStoryAction,
} from "../reducers/storiesSlice";

import { getSnapshotData } from "../../../utils";

export const useStoriesColListener = () => {
	const dispatch = useDispatch();
	const { stories } = useSelector((state) => state.stories);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsub = onSnapshot(
			collection(db, "stories"),
			async (snapshot) => {
				const stories = getSnapshotData(snapshot).map((doc) => ({
					...doc,
					comments: [],
					seen: false,
				}));

				dispatch(setStories(stories));
				setLoading(false);
			}
		);

		return unsub;
	}, []);

	return { stories, loading };
};

export const selectStory = (id, dispatch) => {
	dispatch(selectStoryAction(id));
};

export const setSeenToStory = (id, dispatch) => {
	dispatch(setSeenToStoryAction(id));
};
