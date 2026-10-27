
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

    cosineSimilarity(a, b) {
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;

        for (let i = 0; i < a.length; i++) {
            dotProduct += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }

        if (normA === 0 || normB === 0) {
            return 0;
        }

        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }


    async search(query) {
        const userQueryEmbedding = await generateEmbedding(query);

        const matches = [];

        for (const movie of this.moviesEmbedding) {
            const similarity = this.cosineSimilarity(
                userQueryEmbedding,
                movie.embedding
            );

            matches.push({
                title: movie.title,
                description: movie.description,
                match: similarity,
            });
        }

        matches.sort((a, b) => b.match - a.match);

        return matches.slice(0, 3);
    }


}
