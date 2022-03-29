import {useDispatch, useSelector} from "react-redux";
import {Dispatch, RootState} from "@/store";
import {useCallback, useEffect, useRef} from "react";
import {ethers} from "ethers";
import {metaMask, walletConnect} from "./wallets";

export default function useConnectWallet() {
  const {provider, signer, chainId} = useSelector((state: RootState) => state.ethers);
  const web3ModalInstance = useRef<any>();
  const account = useSelector((state: RootState) => state.userInfo?.account);
  const dispatch = useDispatch<Dispatch>();

  const connect = useCallback(async (result) => {
    let chainId;
    if(result.chainId){
      chainId = result.chainId
    } else  {
      const network = await result.provider.getNetwork();
      chainId = network.chainId;
    }
    dispatch.ethers.setChainId(chainId);
    dispatch.userInfo.setAccount(result.account);
    dispatch.ethers.setProvider(result.provider);
    dispatch.ethers.setSigner(result.signer);
  }, [dispatch]);

  const connectMetaMask = useCallback(async () => {
    try {
      const result = await metaMask();
      await connect(result);
      localStorage.setItem('isConnected', 'MetaMask');
    } catch (e: any) {
      alert(e.message || e);
    }
  }, [])

  const connectWalletConnect = useCallback(async () => {
    try {
      const result = await walletConnect();
      await connect(result);
      localStorage.setItem('isConnected', 'WalletConnect');
    } catch (e: any) {
      alert(e.message || e);
    }
  }, [])

  const disconnect = useCallback(() => {
    web3ModalInstance.current?.clearCachedProvider();
    localStorage.removeItem('isConnected');
    dispatch.userInfo.setAccount();
    dispatch.ethers.setProvider();
    dispatch.ethers.setSigner();
    dispatch.ethers.setChainId(1);

  }, [provider, web3ModalInstance])

  const subscribeProvider = useCallback(() => {
    if (provider) {
      if (window.ethereum && window.ethereum.isConnected && window.ethereum.isConnected()) {

        window.ethereum.on("accountsChanged", (accounts: string[]) => {
          if (accounts.length) {
            dispatch.userInfo.setAccount(ethers.utils.getAddress(accounts[0]));
          } else {
            disconnect();
          }
        });

        window.ethereum.on("chainChanged", (chainId: number) => {
          dispatch.ethers.setChainId(chainId);
        });
      } else {
        provider.on("close", () => {
          disconnect();
        });

        provider.on("accountsChanged", (accounts: string[]) => {
          if (accounts.length) {
            dispatch.userInfo.setAccount(ethers.utils.getAddress(accounts[0]));
          } else {
            disconnect();
          }
        });

        provider.on("networkChanged", (chainId: number) => {
          dispatch.ethers.setChainId(chainId);
        });
      }
    }
  }, [provider, disconnect])


  useEffect(() => {
    subscribeProvider();
  }, [disconnect, subscribeProvider])

  // auto reconnect
  useEffect(() => {
    const connected = localStorage.getItem('isConnected');
    if (!account && connected === 'MetaMask') {
      connectMetaMask();
    }
  }, [connectMetaMask, account])

  return {
    provider,
    signer,
    account,
    chainId,
    connectMetaMask,
    connectWalletConnect,
    disconnect,
  }
};