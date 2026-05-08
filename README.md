# HN Scraper

A MERN stack app that scrapes top stories from Hacker News.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/himanshushiv04/web-scraper.git
cd web-scraper
```

---

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file inside the `Backend/` folder:

```env
PORT=8000
DB_NAME=webscraper
DATABASE_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=any_random_secret_string
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=another_random_secret_string
REFRESH_TOKEN_EXPIRY=10d

CORS_ORIGIN=http://localhost:5174
NODE_ENV=development
```

Start the server:

```bash
npm run dev
```

Backend runs at `http://localhost:8000`

---

### 3. Frontend Setup

Open a new terminal:

```bash
cd Frontend
npm install
```

Create a `.env` file inside the `Frontend/` folder:

```env
VITE_API_URL=http://localhost:8000/api
```

Start the frontend:

```bash
npm run dev
```

Open your browser at `http://localhost:5174`

---

## Note

> If the frontend runs on port **5173** instead of 5173, update `CORS_ORIGIN=http://localhost:5173` in `Backend/.env` and restart the backend.