import { getMovieDetails } from "./tmdbService.js";

const main = async () => {
    try {
        const movie = await getMovieDetails("Interstellar");
        console.log(movie);
    } catch (error) {
        console.error(error.message);
    }
};

main();