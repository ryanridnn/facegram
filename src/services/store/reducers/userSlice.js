import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	currentUser: null,
	selectedUser: { posts: [] },
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		login(state, { payload }) {
			state.currentUser = payload;
		},
		logout(state) {
			state.currentUser = null;
		},
		setSelectedUser(state, { payload }) {
			state.selectedUser = {
				...payload,
				posts: state.selectedUser.posts,
			};
		},
		addPostToSelectedUser(state, { payload }) {
			if (!state.selectedUser) return;
			if (state.selectedUser.posts)
				state.selectedUser.posts = [
					...payload,
					...state.selectedUser.posts,
				];
			else {
				state.selectedUser.posts = payload;
			}
		},
		removePostFromSelectedUser(state, { payload }) {
			state.selectedUser.posts = state.selectedUser.posts.filter(
				(post) => post.id !== payload
			);
		},
		clearPostFromSelectedUser(state) {
			state.selectedUser.posts = [];
		},
	},
});

export const {
	login,
	logout,
	setSelectedUser,
	addPostToSelectedUser,
	removePostFromSelectedUser,
	clearPostFromSelectedUser,
} = userSlice.actions;

export default userSlice.reducer;
