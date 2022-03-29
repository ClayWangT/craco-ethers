import {ethers} from "ethers";
import {Buffer} from "buffer";
import WalletConnectProvider from "@walletconnect/ethereum-provider";

export const metaMask = async () => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any"); // network needs change so set 'any'
    let accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
    const signer = provider.getSigner();
    // accounts = await provider.listAccounts();
    const account = ethers.utils.getAddress(accounts[0]); // must getAddress because caps
    let chainId;
    if(window.ethereum.chainId){
      chainId = Number(window.ethereum.chainId)
    }
    return {
      provider,
      signer,
      account,
      chainId
    }
  } else {
    throw 'MetaMask Not Found'
  }
}

export const walletConnect = async () => {
  try {
    if(!window.Buffer) { // foolish library need 'Buffer'
      window.Buffer = Buffer;
    }
    const wProvider = new WalletConnectProvider({
      // infuraId: 'you infura id',
      qrcodeModalOptions: {
        // mobileLinks: [
        //   "rainbow",
        //   "metamask",
        //   "argent",
        //   "trust",
        //   "imtoken",
        //   "pillar",
        // ],
        // desktopLinks: [
        //   "encrypted ink",
        // ]
      }
    });
    await wProvider.enable();

    const provider = new ethers.providers.Web3Provider(wProvider, 'any');
    let accounts = await provider.listAccounts();
    const signer = provider.getSigner();
    const account = ethers.utils.getAddress(accounts[0]);
    const chainId = (await provider.getNetwork()).chainId
    return {
      provider,
      signer,
      account,
      chainId
    }
  } catch (e) {
    console.log('@ wallet connect error =', e)
    throw e;
  }

}