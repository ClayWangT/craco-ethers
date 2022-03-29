import { Models } from "@rematch/core";
import { ethers } from "./ethers";
import { userInfo } from "./userInfo";

export interface RootModel extends Models<RootModel> {
  userInfo: typeof userInfo
  ethers: typeof ethers,
}

export const models: RootModel = {
  userInfo,
  ethers,
};
