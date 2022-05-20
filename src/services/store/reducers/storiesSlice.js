import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	stories: [],
	selectedStoryIndex: null,
};

const storiesSlice = createSlice({
	name: "stories",
	initialState,
	reducers: {
		setStories(state, { payload }) {
			state.stories = payload;
		},
		selectStory(state, { payload }) {
			const index = state.stories.findIndex(
				(story) => story.id === payload
			);

			state.selectedStoryIndex = index >= 0 ? index : null;
		},
		setSeenToStory(state, { payload }) {
			const story = state.stories.find((story) => story.id === payload);
			if (!story) return;
			else if (story.seen) return;
			story.seen = true;

			state.stories = state.stories.filter(
				(story) => story.id !== payload
			);
			state.stories = [...state.stories, story];
		},
	},
});

export const { setStories, selectStory, setSeenToStory } = storiesSlice.actions;

export default storiesSlice.reducer;
