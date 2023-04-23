import { type TransactionError, type Transaction, type TransactionResultWithId, type NFT } from "@thirdweb-dev/sdk";
import useEtherPrice from "./useEtherPrice";
import { type Fraction, Token, TokenAmount } from "@uniswap/sdk";
import { NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";
import { useEffect, useState } from "react";
import { useActiveChain } from "@thirdweb-dev/react";
import { bsc } from "wagmi/chains";

type Gas = {
  ether: TokenAmount;
  usd: Fraction;
}

const useEstimatedGas = (preparedTx: Transaction | Transaction<TransactionResultWithId<NFT>[]> | undefined) => {
  const chain = useActiveChain();
  const etherPrice = useEtherPrice(chain?.chainId || bsc.id);
  const [gas, setGas] = useState<Gas>();
  const [error, setError] = useState<TransactionError>();

  useEffect(() => {
    if (!preparedTx || !chain) return;
    setError(undefined);
    const estimateGas = async () => {
      try {
        const gas = await preparedTx.estimateGasCost();
        const gasAmount = new TokenAmount(new Token(
          chain.chainId,
          NATIVE_TOKEN_ADDRESS,
          18,
          chain.nativeCurrency.symbol,
          chain.nativeCurrency.name
        ), gas.wei.toString());
  
        setGas({
          ether: gasAmount,
          usd: gasAmount.multiply(etherPrice),
        });
      } catch (e) {
        setError(e as TransactionError);
      }
    };
    void estimateGas();
  }, [preparedTx, chain, etherPrice]);

  return { gas, error };
};

export default useEstimatedGas;