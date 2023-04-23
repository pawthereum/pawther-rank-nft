import {
  MediaRenderer,
  useAddress,
  useSigner,
  useContract,
  useContractMetadata,
  useTotalCount,
  useOwnedNFTs,
  Web3Button,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { useMemo } from "react";
import styles from "../styles/Theme.module.css";
import useEstimatedGas from "../hooks/useEstimatedGas";
import Link from "next/link";
import { Twitter } from "react-feather";
import Head from "next/head";


// Put Your NFT Drop Contract address from the dashboard here
const myNftDropContractAddress = "0x018A59D35EfBcF001CF83972BBbAe246FC86F1D6";

const Home: NextPage = () => {
  const { contract: nftDrop, isLoading } = useContract(myNftDropContractAddress);

  const address = useAddress();
  const signer = useSigner();

  const { data: contractMetadata } = useContractMetadata(nftDrop);
  const { data: totalCount } = useTotalCount(nftDrop);
  const { data: ownedNfts } = useOwnedNFTs(nftDrop, address);

  const preparedTx = useMemo(() => {
    if (!nftDrop || !address || !signer) return undefined;
    try {
      return nftDrop.prepare("mintTo", [address]);
    } catch (e) {
      // there is sometimes an error if signer is not prepared
    }
  }, [nftDrop, address, signer]);

  const estimatedGas = useEstimatedGas(preparedTx);

  function shareOnTwitter() {
    const tweetMessage = `I just minted my free Pawther Rank NFT from @pawthereum!\n\n🐾 Get yours too!\n\n`;
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(tweetMessage)}`;
    window.open(url, '_blank');
  }

  return (
    <div>
      <Head>
        <title>Pawther Rank NFT Drop</title>
        <meta name="twitter:card" content="summary_large_image"></meta>
        <meta name="twitter:site" content="@pawthereum"></meta>
        <meta name="twitter:creator" content="@pawthereum"></meta>
        <meta name="twitter:title" content="Mint your Pawther Rank NFT for Free"></meta>
        <meta name="twitter:description" content="Pawther ranks are based on how much Pawthereum you hold. Start off as a Stray Cat and work your way up to Lion! As your $PAWTH balance grows, your NFT automatically updates to showcase your current rank!"></meta>
        <meta name="twitter:image" content={ownedNfts?.[0]?.metadata?.image || "https://cdn.discordapp.com/attachments/891351589162483732/931878322676322304/finfinfin.png"}></meta>
      </Head>
      <div className={styles.container}>
        <div className={styles.mintInfoContainer}>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className={styles.infoSide}>
                {/* Title of your NFT Collection */}
                <h1>{contractMetadata?.name}</h1>
                {/* Description of your NFT Collection */}
                <div className={styles.description}>
                  {/* {contractMetadata?.description} */}
                  Watch your&nbsp;
                  <Link style={{ textDecoration: "underline", color: "inherit" }} href="https://cdn.discordapp.com/attachments/891351589162483732/931878322676322304/finfinfin.png">
                    Pawther Rank 
                  </Link>
                  &nbsp;increase as you collect more Pawthereum!
                </div>
              </div>

              <div className={styles.imageSide}>
                {/* Image Preview of NFTs */}
                {ownedNfts?.length ? (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <MediaRenderer
                      className={styles.image}
                      src={ownedNfts[0].metadata.image}
                      alt={`${ownedNfts[0].metadata?.name} preview image`}
                    />
                    <div style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "8px" }}>{ownedNfts[0].metadata.name}</div>
                    <button onClick={shareOnTwitter} className={styles.mainButton}><Twitter />&nbsp;&nbsp;Share on Twitter</button>
                  </div>
                ) : (
                  <div>
                    <MediaRenderer
                      className={styles.image}
                      width="100%"
                      src={contractMetadata?.image}
                      alt={`${contractMetadata?.name} preview image`}
                    />
                    {/* Amount claimed so far */}
                    <div className={styles.mintCompletionArea}>
                      <div style={{ textAlign: "center", width: "100%", opacity: 0.75 }}>
                        <p>Total Minted: {Number(totalCount?.toString() || "0").toLocaleString()}</p>
                      </div>
                    </div>

                    <Web3Button
                      contractAddress={nftDrop?.getAddress() || ""}
                      action={() => preparedTx?.execute()}
                      isDisabled={isLoading || !preparedTx || estimatedGas.error !== undefined}
                      onError={(err) => {
                        console.error(err);
                        alert("Error claiming NFTs");
                      }}
                      onSuccess={() => {
                        alert("Successfully claimed NFTs");
                      }}
                    >
                      {isLoading ? "Loading..." : "Mint Your Free Rank"}
                    </Web3Button>

                    {!estimatedGas.error && address && (
                      <div className={styles.estimatedGas}>
                        <div>~${estimatedGas.gas?.usd.toFixed(2, { groupSeparator: "," })} Gas Fee</div>
                      </div>
                    )}
                    {estimatedGas.error && (
                      <div className={styles.error}>
                        {estimatedGas.error.reason === "Not authorized to mint." ? "You can only mint 1 NFT per wallet." : estimatedGas.error.reason}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        {/* Powered by Pawthereum and Thirdweb */}{" "}
        <div style={{ marginTop: "2rem", marginBottom: "8rem", fontSize: "0.85rem" }}>
          <Link style={{ color: "inherit" }} href="https://pawthereum.com">
            Learn more about Pawthereum
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
