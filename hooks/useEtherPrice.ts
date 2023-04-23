import { Token, TokenAmount } from "@uniswap/sdk";
import { useMemo, useState } from "react";
import { NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";
import aggregatorV3InterfaceABI from "../constants/abi/priceFeed";
import { Address, goerli, mainnet, sepolia, useContractReads } from "wagmi";
import { avalanche, avalancheFuji, bsc, bscTestnet, cronos, polygon, polygonMumbai } from "wagmi/chains";
import { useContractRead, useContract } from "@thirdweb-dev/react";

type PriceOracle = {
  [chainId: string]: string;
};

const NATIVE_ASSET_PRICE_ORACLES: PriceOracle = {
  [mainnet.id]: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419", // ETH / USD
  [goerli.id]: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419", // ETH / USD
  [sepolia.id]: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419", // ETH / USD
  [bsc.id]: "0x0567f2323251f0aab15c8dfb1967e4e8a7d42aee", // BNB / USD
  [bscTestnet.id]: "0x0567f2323251f0aab15c8dfb1967e4e8a7d42aee", // BNB / USD
  [avalanche.id]: "0xFF3EEb22B5E3dE6e705b44749C2559d704923FD7", // AVAX / USD
  [avalancheFuji.id]: "0xFF3EEb22B5E3dE6e705b44749C2559d704923FD7", // AVAX / USD
  [cronos.id]: "0x00Cb80Cf097D9aA9A3779ad8EE7cF98437eaE050", // CRO / USD
  [polygon.id]: "0x7bAC85A8a13A4BcD8abb3eB7d6b4d632c5a57676", // MATIC / USD
  [polygonMumbai.id]: "0x7bAC85A8a13A4BcD8abb3eB7d6b4d632c5a57676", // MATIC / USD
}

const useEtherPrice = (chainId: number) => {
  const { contract: oracleContract } = useContract(NATIVE_ASSET_PRICE_ORACLES[chainId || bsc.id]);
  const { data: decimals } = useContractRead(oracleContract, "decimals");
  const { data: latestRoundData } = useContractRead(oracleContract, "latestRoundData");

  const price = useMemo(() => {
    const usd = new Token(
      chainId, 
      NATIVE_TOKEN_ADDRESS,
      decimals || 6,
      "USD",
      "US Dollar"
    );
    if (!latestRoundData || !decimals) {
      return new TokenAmount(usd, "0");
    }
    return new TokenAmount(usd, latestRoundData.answer.toString());
  }, [chainId, decimals, latestRoundData]);


  return price;
}

export default useEtherPrice;