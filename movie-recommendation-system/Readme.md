# 🎬 AI-Powered Movie Recommendation System

**Discover movies by meaning, not just keywords.**

An AI-powered movie recommendation system that uses semantic search and vector similarity to understand natural-language queries and recommend relevant movies.

Instead of relying only on traditional keyword matching, this project uses **Google Gemini Embedding 2** to convert movie descriptions and user queries into vector embeddings, then applies **Cosine Similarity** to find relevant recommendations.

---

## ✨ Features

- **Semantic Movie Search:** Search using natural-language queries such as *"I want a survival movie set in space."*
- **AI-Powered Embeddings:** Generate 3072-dimensional vector embeddings using Gemini Embedding 2.
- **Similar Movie Recommendations:** Discover movies based on semantic similarity.
- **Cosine Similarity:** Calculate similarity between movie embeddings.
- **TMDB Integration:** Display movie posters, ratings, release dates, and descriptions.
- **Interactive Frontend:** Search and explore recommendations through a responsive web interface.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| JavaScript | Application development |
| Node.js | Backend runtime |
| Express.js | REST API |
| Google Gemini Embedding 2 | Text embeddings |
| Cosine Similarity | Vector similarity calculation |
| TMDB API | Movie metadata and posters |
| HTML, CSS, JavaScript | Frontend |

## 🧠 How It Works

1. **Movie Data:** Movie information and descriptions are stored in `movies.json`.
2. **Embedding Generation:** Gemini Embedding 2 converts movie descriptions into 3072-dimensional vectors.
3. **User Query:** The user enters a natural-language search query.
4. **Query Embedding:** The query is converted into a vector using the same embedding model.
5. **Similarity Calculation:** Cosine Similarity compares the query vector with movie vectors.
6. **Ranking:** Movies are ranked according to their similarity scores.
7. **Movie Details:** TMDB API provides additional movie information, including posters and ratings.

## 🏗️ Project Structure

```text
movie-recommendation-system/
│
├── public/
│   └── index.html
│
├── movies.json
├── movieService.js
├── embeddingService.js
├── tmdbService.js
├── server.js
├── package.json
├── package-lock.json
└── .env
```

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Pavan-0002/FDE.git
```

### 2. Navigate to the project

```bash
cd FDE/movie-recommendation-system
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
TMDB_ACCESS_TOKEN=your_tmdb_access_token
```

Get your credentials:

- [Google AI Studio](https://aistudio.google.com/) — Gemini API key
- [TMDB](https://www.themoviedb.org/settings/api) — API access token

**Important:** Never commit your `.env` file or expose your API credentials publicly.

### 5. Start the application

```bash
node server.js
```

Open your browser:

```text
http://localhost:3000
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/movies` | Retrieve available movies |
| POST | `/api/movies/search` | Search movies using semantic similarity |
| GET | `/api/movies/:title/similar` | Find similar movies |
| GET | `/api/tmdb/:title` | Retrieve movie details from TMDB |

### Example: Semantic Search

**Request**

```http
POST /api/movies/search
Content-Type: application/json
```

```json
{
  "query": "I want a survival movie set in space"
}
```

The API returns movies ranked by semantic similarity.

## 📐 Core Concept: Cosine Similarity

Cosine Similarity measures the similarity between two vectors by calculating the cosine of the angle between them.

\[
\text{Similarity}(A,B)=
\frac{A\cdot B}{\|A\|\|B\|}
\]

A higher score indicates greater directional similarity between the vectors.

This allows the system to identify movies with related themes and meanings, even when their descriptions use different words.

## 🎯 Learning Outcomes

Through this project, I explored and implemented:

- Understanding text embeddings and vector representations.
- Generating embeddings using an embedding model.
- Implementing Cosine Similarity from scratch.
- Building semantic search functionality.
- Designing REST APIs using Express.js.
- Integrating external APIs.
- Connecting backend services with a frontend application.

## 🚀 Future Improvements

- Store embeddings in a vector database.
- Add more movies and improve recommendation coverage.
- Implement embedding caching to reduce repeated API calls.
- Add user preferences and personalized recommendations.
- Deploy the application for public access.

## 🙌 Acknowledgements

Built as part of my **Forward-Deployed Engineering (FDE)** learning journey.

Special thanks to **Aditya Tandon and Coder Army** for the practical learning experience and guidance.

---

**If you find this project interesting, feel free to explore the repository and share your feedback!**

⭐ Star the repository if you like it.