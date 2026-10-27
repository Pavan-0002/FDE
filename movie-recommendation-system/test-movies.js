
import { MovieService } from "./movieService.js";

const movieService = new MovieService();

async function main() {
  // First, generate embeddings for all movies.
  await movieService.initializeMovies();

  console.log("First movie:", movieService.moviesEmbedding[0].title);
  console.log(
    "Embedding dimensions:",
    movieService.moviesEmbedding[0].embedding.length
  );

  // Test cosine similarity.
  const interstellar = movieService.moviesEmbedding.find(
    (movie) => movie.title === "Interstellar"
  );

  const martian = movieService.moviesEmbedding.find(
    (movie) => movie.title === "The Martian"
  );

  const similarity = movieService.cosineSimilarity(
    interstellar.embedding,
    martian.embedding
  );

  console.log("Interstellar vs The Martian:", similarity);

  // Now test semantic search.
  const results = await movieService.search(
    "I want a survival movie set in space"
  );

  console.log("\nSearch results:");
  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);
