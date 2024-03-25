import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import rootReducer from './reducer';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
const persistConfig = {
  key: 'root',
  storage,
}
const persistedReducer = persistReducer(persistConfig, rootReducer);

const appStore = () => {
  const store = configureStore(
    {
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          }
        }),
      devTools: process.env.NODE_ENV !== 'production'
        ? {
          name: 'Book Store', // Specify the name you want to appear in DevTools
          trace: true, // Enable state traces for better debugging
        }
        : false,
    },
  );
  const persistor = persistStore(store);
  return { store, persistor };
}

export default appStore;