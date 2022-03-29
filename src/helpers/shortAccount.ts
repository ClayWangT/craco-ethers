const regex = /(0x\w{7})(\w+)(\w{6})/i;

export default function shortAccount(account: string){
  return account.replace(regex, '$1...$3');
};