
import { MovieService } from "./movieService.js";

const movieService = new MovieService();

async function main() {
  await movieService.initializeMovies();

  console.log("First movie:", movieService.moviesEmbedding[0].title);
  console.log(
    "Embedding dimensions:",
    movieService.moviesEmbedding[0].embedding.length
  );
}

main().catch(console.error);
