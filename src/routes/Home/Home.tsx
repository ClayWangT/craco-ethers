import styles from './Home.m.scss'
import React, {useEffect} from "react";
import useConnectWallet from "@/hooks/useConnectWallet";
import {useDispatch, useSelector} from "react-redux";
import {Dispatch, RootState} from "@/store";
import {formatNumberToKM} from "@/helpers/number";
import {ethers} from "ethers";
import {getChainData} from "@/helpers/ethUtils";

export default function Home() {
  const {account, provider, chainId, connectMetaMask, connectWalletConnect, disconnect} = useConnectWallet();

  const dispatch = useDispatch<Dispatch>();
  const ETH = useSelector((state: RootState) => state.userInfo?.ETH || '-');

  useEffect(() => {
    dispatch.userInfo.setETH('-');
    if (account && provider) {
      provider.getBalance(account).then(value => {
        dispatch.userInfo.setETH(ethers.utils.formatEther(value))
      }).catch(error => {
        alert(`Error: ` + error.message || error);
      })
    }
  }, [account, provider, chainId])

  return <div className={styles.homeLayout}>
    {
      account ? <>
        account: {account}<br/>
        chain: {getChainData(chainId)?.name}<br/>
        ETH: {formatNumberToKM(ETH, 2, '')}<br/>
        <br/>
        <button onClick={disconnect}>disconnect</button>
      </> : <>
        <button onClick={connectMetaMask}>connect MetaMask</button>
        <br/><br/>
        <button onClick={connectWalletConnect}>connect walletConnect</button>
      </>
    }
  </div>
};