import { init, RematchDispatch, RematchRootState } from '@rematch/core'
import loading, { ExtraModelsFromLoading } from '@rematch/loading'
import updated, { ExtraModelsFromUpdated } from '@rematch/updated'
import persist from '@rematch/persist'
import storage from 'redux-persist/lib/storage'
import immerPlugin from '@rematch/immer'
import selectPlugin from '@rematch/select'
import { models, RootModel } from './models'

import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history'

export const history = createBrowserHistory();

type FullModel = ExtraModelsFromLoading<RootModel> &
  ExtraModelsFromUpdated<RootModel>;

const reducers = { router: connectRouter(history) };
export const store = init<RootModel, FullModel>({
  redux: {
    reducers,
    middlewares: [
      routerMiddleware(history)
    ],
    devtoolOptions: {}
  },
  models,
  plugins: [
    updated(),
    loading(),
    persist({
      key: 'persist-storage',
      storage,
      blacklist: ['ethers', 'userInfo']
    }),
    immerPlugin(),
    selectPlugin(),
  ],
})
if(process.env.NODE_ENV === 'development'){ // @ts-ignore
  window.store = store
}


export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel, FullModel>
