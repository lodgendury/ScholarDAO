import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const editionDrop = sdk.getEditionDrop("0x77738af784B6C36Bd5C741059499A9592F312ea9");

(async () => {
  try {
    await editionDrop.createBatch([
      {
        name: "Four Horsemen",
        description: "This NFT will give you access to ScholarDAO!",
        image: readFileSync("scripts/assets/fourmen.jpg"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})();