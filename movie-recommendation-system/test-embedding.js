
import { generateEmbedding } from "./embeddingService.js";

async function main() {
  const embedding = await generateEmbedding(
    "A team of astronauts travels through a wormhole to find a habitable planet."
  );

  console.log("Embedding dimensions:", embedding.length);
  console.log("First 10 values:", embedding.slice(0, 10));
}

main().catch(console.error);
