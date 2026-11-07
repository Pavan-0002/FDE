import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { MovieService } from "./movieService.js";
import { getMovieDetails } from "./tmdbService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const movieService = new MovieService();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const movies = [
  {
    id: 1,
    title: "Interstellar",
    description:
      "A team of astronauts travels through a wormhole to find a new habitable planet for humanity."
  },
  {
    id: 2,
    title: "The Martian",
    description:
      "An astronaut becomes stranded on Mars and uses science and ingenuity to survive."
  },
  {
    id: 3,
    title: "Gravity",
    description:
      "Two astronauts struggle to survive after a disaster leaves them stranded in space."
  },
  {
    id: 4,
    title: "The Pursuit of Happyness",
    description:
      "A struggling father faces financial hardship while working toward a better life for his son."
  },
  {
    id: 5,
    title: "Finding Nemo",
    description:
      "A clownfish travels across the ocean to find his missing son and faces many dangers along the way."
  }
];

app.get("/api/movies", (req, res) => {
  res.json(movies);
});

app.get("/api/tmdb/:title", async (req, res) => {
    try {
        const { title } = req.params;

        const movie = await getMovieDetails(title);

        if (!movie) {
            return res.status(404).json({
                error: "Movie not found on TMDB"
            });
        }

        res.json(movie);

    } catch (error) {
        console.error("TMDB route error:", error);

        res.status(500).json({
            error: "Failed to fetch movie details"
        });
    }
});

app.get("/api/movies/:title/similar", async (req, res) => {
  try {
    const { title } = req.params;

    const results = await movieService.similarMovies(title);

    res.json(results);
  } catch (error) {
    console.error("Similar movies error:", error);

    res.status(404).json({
      error: error.message,
    });
  }
});

app.post("/api/movies/search", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        error: "Search query is required",
      });
    }

    const results = await movieService.search(query);

    res.json(results);
  } catch (error) {
    console.error("Search error:", error);

    res.status(500).json({
      error: "Failed to search movies",
    });
  }
});

app.listen(PORT, () => {
  async function startServer() {
  try {
    await movieService.initializeMovies();

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize movies:", error);
  }
}

startServer();
});
