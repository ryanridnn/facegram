import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
	posts: [],
	comments: [],
};

const postsSlice = createSlice({
	name: "posts",
	initialState,
	reducers: {
		setPosts(state, { payload }) {
			state.posts = payload;
		},
		addCommentsCollection(state, { payload }) {
			state.comments = [...state.comments, payload.comments];
		},
		addComment(state, { payload }) {
			const commentsCollections = current(state.comments);
			const commentsCollection = commentsCollections.find(
				(commentsCollection) =>
					commentsCollection.postId === payload.postId
			);
			const index = commentsCollections.indexOf(commentsCollection);

			state.comments[index].comments = [
				...commentsCollections[index].comments,
				payload.comment,
			];
		},
		deleteComment(state, { payload }) {
			const commentsCollections = current(state.comments);
			const commentsCollection = commentsCollections.find(
				(commentsCollection) =>
					commentsCollection.postId === payload.postId
			);

			const index = commentsCollections.indexOf(commentsCollection);

			state.comments[index].comments = commentsCollections[
				index
			].comments.filter((comment) => comment.id !== payload.commentId);
		},
	},
});

export const { setPosts, addCommentsCollection, addComment, deleteComment } =
	postsSlice.actions;

export default postsSlice.reducer;
