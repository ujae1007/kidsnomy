import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // 로컬 스토리지 사용
import authReducer from './slices/authSlice';
import groupReducer from './slices/groupSlice';
import jobReducer from './slices/jobSlice';

// Persist 설정
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['accessToken', 'refreshToken', 'isAuthenticated', 'isParent']
};

const groupPersistConfig = {
  key: 'group',
  storage,
  whitelist: ['selectedGroupId']
};

const jobPersistConfig = {
  key: 'job',
  storage,
  whitelist: ['availableJobs', 'contractedJobs']
};

// 스토어 생성
export const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    group: persistReducer(groupPersistConfig, groupReducer),
    job: persistReducer(jobPersistConfig, jobReducer)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export const persistor = persistStore(store);

// 타입 설정
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 