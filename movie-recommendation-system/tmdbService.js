
import "dotenv/config";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

export async function getMovieDetails(title) {
    const response = await fetch(
        `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(title)}`,
        {
            headers: {
                Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
                accept: "application/json"
            }
        }
    );

    if (!response.ok) {
    const errorDetails = await response.text();

    console.log("TMDB Status:", response.status);
    console.log("TMDB Error Details:", errorDetails);

    throw new Error("TMDB request failed");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        return null;
    }

    const movie = data.results[0];

    return {
        title: movie.title,
        overview: movie.overview,
        releaseDate: movie.release_date,
        rating: movie.vote_average,
        poster: movie.poster_path
            ? `${TMDB_IMAGE_URL}${movie.poster_path}`
            : null,
        backdrop: movie.backdrop_path
            ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
            : null
    };
}
