import { createModel } from '@rematch/core'
import type { RootModel } from '.'
import {ethers as Ethers} from "ethers";

interface EthersState {
  provider?: Ethers.providers.Web3Provider;
  signer?: Ethers.providers.JsonRpcSigner;
  chainId: number;
}

export const ethers = createModel<RootModel>()({
  state: {
    provider: undefined,
    signer: undefined,
    chainId: 1,
  } as EthersState,
  reducers: {
    setProvider(state, provider?: Ethers.providers.Web3Provider){
      state.provider = provider;
      return state;
    },
    setSigner(state, signer?: Ethers.providers.JsonRpcSigner){
      state.signer = signer;
      return state;
    },
    setChainId(state, chainId: number) {
      state.chainId = Number(chainId);
      return state;
    },
  },
})
