import sdk from "./1-initialize-sdk.js";

// This is the address to our ERC-1155 membership NFT contract.
const editionDrop = sdk.getEditionDrop("0x77738af784B6C36Bd5C741059499A9592F312ea9");

// This is the address to our ERC-20 token contract.
const token = sdk.getToken("0x684f9205b38B3dd0D31B8d5c2192256f50435453");

(async () => {
  try {
    // Grab all the addresses of people who own our membership NFT, 
    // which has a tokenId of 0.
  
    const walletAddresses = await editionDrop.history.getAllClaimerAddresses(0);

    if (walletAddresses.length === 0) {
      console.log(
        "No NFTs have been claimed yet, maybe get some friends to claim your free NFTs!",
      );
      process.exit(0);
    }

    // Loop through the array of addresses.
    const airdropTargets = walletAddresses.map((address, index) => {
      // Pick a random # between 1000 and 10000.
      if (index === 0) {
        const dropAmount = 50000;

        console.log("✅ Going to airdrop", dropAmount, "tokens to", address);

      // Set up the target.
      const airdropTarget = {
        toAddress: address,
        amount: dropAmount,
      };

      return airdropTarget;
      } else {
        const divider = index * 10
        const dropAmount = Math.floor(100000 / divider);
        console.log("✅ Going to airdrop", dropAmount, "tokens to", address);

      // Set up the target.
      const airdropTarget = {
        toAddress: address,
        amount: dropAmount,
      };

      return airdropTarget;
      }
      
      
    });

    // Call transferBatch on all our airdrop targets.
    console.log("🌈 Starting airdrop...");
    await token.transferBatch(airdropTargets);
    console.log("✅ Successfully airdropped tokens to all the holders of the NFT!");
  } catch (err) {
    console.error("Failed to airdrop tokens", err);
  }
})();