import { ChainMergeClient } from "chainmerge-sdk";

// Initialize SDK
export const chainmerge = new ChainMergeClient({});

// Mock stream of interesting transaction hashes for the hackathon demo.
// In production, this would be an RPC Mempool listener or webhook.
const DEMO_HASHES = [
  { chain: "ethereum", hash: "0x8999abc123exploit_attempt_456" },
  { chain: "solana", hash: "5Kabcwhale_dump_xyz999" },
  { chain: "arbitrum", hash: "0xfailed_flashloan_777" },
];

export async function fetchNextDemoEvent(index: number) {
  const target = DEMO_HASHES[index % DEMO_HASHES.length];
  
  try {
    // We attempt to decode via the real SDK. 
    // If the hash is fake/doesn't exist in the real API, we will mock the SDK payload 
    // for the sake of an impressive, non-stop hackathon live demo output.
    const decoded = await chainmerge.decodeTx({ chain: target.chain, hash: target.hash });
    return decoded;
  } catch (err) {
    // Mocking the SDK's normalized output format for the demo
    if (target.chain === 'ethereum') {
       return {
         chain: "ethereum",
         tx_hash: target.hash,
         events: [
           { event_type: "exploit_attempt", protocol: "Aave V3", error: "Reverted: Slippage exceeded", amount: "5000000 USDC" }
         ]
       };
    } else if (target.chain === 'solana') {
       return {
         chain: "solana",
         tx_hash: target.hash,
         events: [
           { event_type: "token_transfer", token: "USDC", amount: "15000000", from: "WhaleWalletA", to: "BinanceHot" }
         ]
       };
    } else {
        return {
            chain: "arbitrum",
            tx_hash: target.hash,
            events: [
              { event_type: "flashloan", status: "failed", reason: "Insufficient Liquidity", token: "WETH", amount: "10000" }
            ]
        };
    }
  }
}
