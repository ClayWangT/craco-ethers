import {ethers} from "ethers";

export default function addressIsEqual(address1: string, address2: string){
  return ethers.utils.getAddress(address1) === ethers.utils.getAddress(address2);
}