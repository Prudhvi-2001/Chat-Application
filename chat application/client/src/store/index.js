import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './profileSlice';
import { loadState, saveState } from '../utils/indexedDB';

export const initializeStore = async () => {
  const persistedState = await loadState();

  const store = configureStore({
    reducer: {
      profile: profileReducer,
    },
    preloadedState: {
      profile: persistedState?.profile || null,
    },
  });

  store.subscribe(() => {
    saveState({ profile: store.getState().profile });
  });

  return store;
};
