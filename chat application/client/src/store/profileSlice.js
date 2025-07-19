import { createSlice } from '@reduxjs/toolkit';

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profile: null,
    activeChatThread: null,
  },
  reducers: {
    setProfile: (state, action) => action.payload,
    setActiveChatThread: (state, action) => {
      state.activeChatThread = action.payload;
    },
  },
});

export const { setProfile , setActiveChatThread } = profileSlice.actions;
export default profileSlice.reducer;
