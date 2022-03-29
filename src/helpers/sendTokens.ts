import {ethers} from "ethers";

interface SendTokensParam{
  provider: ethers.providers.Web3Provider;
  to: string;
  from: string | Promise<string>;
  value: string;
  gasLimit?: string;
  gasPrice?: string;
}

export default async function sendTokens ({
  provider,
  to,
  from,
  value,
  gasPrice,
  gasLimit = ethers.utils.hexlify(21000),
}: SendTokensParam)  {
  const txCount = await provider.getTransactionCount(from);
  const result = await provider.getSigner().sendTransaction({
    from,
    nonce: ethers.utils.hexlify(txCount),
    to,
    value: ethers.utils.parseEther(value).toHexString(),
    gasLimit,
    gasPrice,
  })
  const wait = await result.wait()

  return wait;
};

sendTokens.estimateGas = ({
  provider,
  to,
  from,
  value,
}: SendTokensParam) => provider.getSigner().estimateGas({
  from,
  to,
  value: ethers.utils.parseEther(value).toHexString(),
})