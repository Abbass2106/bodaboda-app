# BodaConnect 🏍️ — Dodoma Bodaboda Association Platform

A simple digital platform for a bodaboda association:
- **Customers** request rides (pickup + destination)
- **Riders** see and accept assigned trips
- **Admins** track daily trips, payments, and rider performance

Built with **React (Vite + Tailwind)** for the frontend and **Flask** for the
backend API, packaged together with **Docker**.

---

## Project Structure

```
bodaboda-app/
├── backend/
│   ├── app.py              # Flask API
│   ├── requirements.txt
│   └── static/              # (auto-generated) built React app
├── frontend/
│   ├── src/
│   │   ├── pages/           # Home, RequestRide, RiderDashboard, AdminDashboard
│   │   ├── components/      # Navbar
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── tailwind.config.js
├── Dockerfile
├── docker-compose.yml
└── .dockerignore
```

---

## Option 1: Run with Docker (recommended)

This builds the React app AND runs the Flask server in one container.

```bash
docker compose up --build
```

Then open: **http://localhost:5000**

To stop:
```bash
docker compose down
```

---

## Option 2: Run manually (for development)

### 1. Run the backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Backend runs at `http://localhost:5000`

### 2. Run the frontend (in a new terminal)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173` and talks to the backend automatically.

---

## API Endpoints

| Method | Endpoint                    | Description                       |
|--------|------------------------------|------------------------------------|
| GET    | `/api/health`                | Check the API is running          |
| POST   | `/api/request-ride`          | Customer requests a ride           |
| GET    | `/api/trips`                 | List all trips (optional `?status=`) |
| POST   | `/api/trips/<id>/assign`     | Rider accepts a trip               |
| POST   | `/api/trips/<id>/complete`   | Rider marks trip complete + fare   |
| GET    | `/api/stats`                 | Admin stats (totals, revenue, performance) |

---

## Pages

1. **Home (`/`)** — "Welcome to BodaConnect" landing page
2. **Request Ride (`/request`)** — customer form: name, pickup, destination
3. **Rider Dashboard (`/rider`)** — riders enter their name, see pending requests, accept and complete trips
4. **Admin (`/admin`)** — totals, revenue, rider performance leaderboard, full trip table
