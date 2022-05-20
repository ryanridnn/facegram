import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userSlice";
import postsReducer from "./reducers/postsSlice";
import storiesSlice from "./reducers/storiesSlice";

export const store = configureStore({
	reducer: {
		user: userReducer,
		posts: postsReducer,
		stories: storiesSlice,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});
