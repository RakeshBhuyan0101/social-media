import { configureStore } from '@reduxjs/toolkit'
import authSlice from './AtuthSlice.js'
import { combineReducers } from '@reduxjs/toolkit'
import postSlice from './postSlice.js'
import { 
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import persistReducer from 'redux-persist/es/persistReducer'


const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}

const rootReducer = combineReducers({
    auth:authSlice,
    post : postSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)


const store =  configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),

});
export default store 