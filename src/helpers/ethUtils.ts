import supportedChains from "@/helpers/chains";
import {IChainData} from "@/helpers/types";
import {ethers} from "ethers";

export function getChainData(chainId: number): IChainData {
  const chainData = supportedChains.filter(
    (chain: any) => chain.chain_id === chainId
  )[0];

  if (!chainData) {
    throw new Error(`ChainId missing or not supported @ chainId = ${chainId}`);
  }

  const API_KEY = 'f7b0fbb7f21c4e59b8a4b11ec4b342ae';

  if (
    chainData.rpc_url.includes("infura.io") &&
    chainData.rpc_url.includes("%API_KEY%") &&
    API_KEY
  ) {
    const rpcUrl = chainData.rpc_url.replace("%API_KEY%", API_KEY);

    return {
      ...chainData,
      rpc_url: rpcUrl
    };
  }

  return chainData;
}

export async function switchEthereumChain(provider: ethers.providers.Web3Provider, chainId: number){

  if(provider.provider?.request){
    const chainIdString = ethers.utils.hexValue(chainId);
    try{
      await provider.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{
          chainId: chainIdString
        }],
      })
    } catch (e: any){
      if(e.code === 4902){
        console.info('add chain data')
        const chainData = getChainData(chainId);
        const param = {
          chainName: chainData.name,
          chainId: chainIdString,
          rpcUrls: chainData.rpc_url ? [chainData.rpc_url] : undefined,
          blockExplorerUrls: chainData.block_explorer_url ? [chainData.block_explorer_url] : undefined,
          nativeCurrency: {
            symbol: chainData.native_currency.symbol,
            name: chainData.native_currency.name,
            decimals: Number(chainData.native_currency.decimals),
          },
        }
        await provider.provider.request({
          method: 'wallet_addEthereumChain',
          params: [param],
        });
        await provider.provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{
            chainId: chainIdString
          }],
        })
      } else {
        throw e
      }
    }

  }

}