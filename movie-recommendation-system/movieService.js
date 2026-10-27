
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateEmbedding } from "./embeddingService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class MovieService {
  constructor() {
    this.moviesEmbedding = [];
  }

  async initializeMovies() {
    const filePath = path.join(__dirname, "movies.json");
    const movieData = JSON.parse(fs.readFileSync(filePath, "utf8"));

    for (const movie of movieData) {
      const embedding = await generateEmbedding(movie.description);

      this.moviesEmbedding.push({
        title: movie.title,
        description: movie.description,
        embedding,
      });

      console.log(`Generated embedding: ${movie.title}`);
    }

    console.log(
      `${this.moviesEmbedding.length} movies loaded with embeddings.`
    );
  }
}
