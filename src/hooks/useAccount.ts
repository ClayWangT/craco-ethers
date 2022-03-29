import {useSelector} from "react-redux";
import {RootState} from "@/store";

export default function useAccount(){
  return useSelector((state: RootState) => state.userInfo?.account || '');
};