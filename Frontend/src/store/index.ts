import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // 로컬 스토리지 사용
import authReducer from './slices/authSlice';
import groupReducer from './slices/groupSlice';

// Persist 설정
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['accessToken', 'isParent']
};

const groupPersistConfig = {
  key: 'group',
  storage,
  whitelist: ['selectedGroupId']
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  group: persistReducer(groupPersistConfig, groupReducer)
});

// 스토어 생성
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export const persistor = persistStore(store);

// 타입 설정
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 