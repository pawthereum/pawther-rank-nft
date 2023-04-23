import { SmartContract } from "@thirdweb-dev/sdk";
import { useState, type FC } from "react";
import { useNFTs, MediaRenderer } from "@thirdweb-dev/react";
import { BigNumber } from "ethers";
import useShortenedAddress from "../hooks/useShortenedAddress";
import styles from "../styles/Theme.module.css";

interface NftListProps {
  contract: SmartContract;
  totalCount: BigNumber;
}

export const NftList: FC<NftListProps> = ({ contract, totalCount }) => {
  const { getShortenedAddress } = useShortenedAddress();
  const NUM_NFTS_RENDERD = 2;
  const [start, setStart] = useState<number>(parseInt(totalCount.toString()) - NUM_NFTS_RENDERD);
  const { data, isLoading } = useNFTs(contract, {
    count: NUM_NFTS_RENDERD,
    start
  });

  console.log({ data })

  if (isLoading) return <div style={{ marginTop: "2rem", fontSize: ".75rem", opacity: 0.75 }}>Loading...</div>;

  return (
    <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "2px" }}>
      <div style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "8px" }}>Recent Mints</div>
      {data?.map((nft) => (
        <div key={nft.metadata.id} style={{ display: "flex", alignItems: "center", flexDirection: "row", gap: "2px" }}>
          <MediaRenderer
            src={nft.metadata.image}
            width={"48px"}
            height={"48px"}
            alt={`${nft.metadata.name} preview image`}
          />
          <div style={{ marginLeft: "5px", display: "flex", flexDirection: "column", gap: "1px", fontSize: "0.85rem" }}>
            <div>{getShortenedAddress(nft.owner)}</div>
            <div style={{ fontSize: "0.75rem" }}>{nft.metadata.name}</div>
          </div>
        </div>
      ))}
      {start - NUM_NFTS_RENDERD < 0 ? (
        <div style={{ marginTop: "8px", fontSize: "0.75rem", opacity: 0.75 }}>No more NFTs to load</div>
      ) : (
        <a onClick={() => setStart(start - NUM_NFTS_RENDERD)} style={{ marginTop: "8px", cursor: "pointer", fontSize: ".75rem", opacity: 0.75 }}>Load More</a>
      )}
    </div>
  )
}

export default NftList;