import BigNumber from "bignumber.js";
import {ethers} from "ethers";

export function getBigNumberFromKM(n: string) {
  n = String(n);
  if (n === "NaN" || n === "infinity" || n === "-") {
    return new BigNumber(-1);
  }
  let divider = 1;
  n = n.replaceAll(",", "");
  if (n.includes("K")) {
    divider = 1000;
    n = n.replace("K", "");
  } else if (n.includes("M")) {
    divider = 1000000;
    n = n.replace("M", "");
  } else if(n.includes("B")){
    divider = 1000000000;
    n = n.replace("B", "");
  }
  return new BigNumber(n).multipliedBy(divider);
}

// Format number to be xxM, xxxK style
export function formatNumberToKM(n: any = 0, digits = 0, unit?: "M" | "K" | "" | "B") {
  if (ethers.BigNumber.isBigNumber(n)) {
    n = n.toString();
  }

  if (isNaN(n) || !isFinite(n) || n === "NaN" || n === null) {
    return "-";
  }

  n = new BigNumber(n);
  if (n.abs().isLessThan(1000)) {
    if (unit === "M") {
      return "0M";
    }
    if (n.isEqualTo(0)) return '0'
    return n.toFixed(digits).toString().replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }

  if(unit === undefined) {
    if (n.abs().gte(1000000000)) {
      unit = 'B'
    } else if (n.abs().gte(1000000)) {
      unit = 'M'
    } else if(n.abs().gte(1000)){
      unit = 'K'
    } else {
      unit = ''
    }
  }

  let divisor = 1;
  switch (unit){
    case "B":
      divisor = 1000000000;
      break;
    case "M":
      divisor = 1000000;
      break;
    case "K":
      divisor = 1000;
      break;
  }

  const divided = n.dividedBy(divisor);

  let numberString = divided.toFixed(digits);
  if (digits !== 0) {
    const split = numberString.split(".");
    numberString = new BigNumber(split[0]).toFormat() + "." + split[1];
  } else {
    numberString = new BigNumber(numberString).toFormat();
  }

  return `${numberString}${unit}`;
}

