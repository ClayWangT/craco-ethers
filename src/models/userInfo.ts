import {createModel} from '@rematch/core'
import type {RootModel} from '.'

interface UserInfo {
  account?: string;
  ETH: string;
}

export const userInfo = createModel<RootModel>()({
  state: {
    account: undefined,
    ETH: '-',
  } as UserInfo,
  reducers: {
    setAccount(state, account?: string) {
      state.account = account;
      return state;
    },
    setETH(state, ETH: string) {
      state.ETH = ETH;
      return state;
    },
  },
  effects: (dispatch) => {
    return {

    }
  }
})
