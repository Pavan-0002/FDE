
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
