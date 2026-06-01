# Primetrade AI Assignment

A full-stack product catalog application with JWT authentication and role-based access. Admins manage products; regular users browse the catalog and place orders that decrement stock.

## Features

- **Authentication** — Register and login with email/password; JWT stored in the browser
- **Role-based UI** — `admin` users get a product management dashboard; `user` users can browse and buy
- **Product management** — Create, edit, and delete products (admin only)
- **Orders** — Users place orders (quantity of 1 per click); stock is validated and updated server-side
- **Docker setup** — MongoDB, Express API, and React client orchestrated via Docker Compose

## Tech Stack

| Layer    | Technologies                                      |
| -------- | ------------------------------------------------- |
| Frontend | React 19, Vite 8, React Router, Tailwind CSS 4  |
| Backend  | Node.js, Express 5, Mongoose, JWT, bcrypt, Joi    |
| Database | MongoDB 7                                         |
| DevOps   | Docker, Docker Compose                            |

## Project Structure

```
├── client/                 # React + Vite frontend
│   └── src/
│       ├── components/     # Dashboards, product grid/form, edit modal
│       ├── context/        # Auth state (UserContext)
│       ├── pages/          # Login, register, home, logout
│       └── services/       # API client (fetch + JWT header)
├── server/                 # Express REST API
│   ├── config/             # MongoDB connection
│   ├── controllers/        # Auth and product/order logic
│   ├── middleware/         # JWT verification and role checks
│   ├── models/             # User and Product schemas
│   └── routes/             # /api/auth and /api/* routes
├── docker-compose.yml      # server, client, and db services
└── .env.example            # Environment variable template
```

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose (recommended), **or**
- Node.js 20+ and a running MongoDB instance for local development

## Environment Variables

Copy `.env.example` to `.env` in the project root and configure:

| Variable        | Description |
| --------------- | ----------- |
| `FRONTEND_PORT` | Client port (default: `5000`) |
| `BACKEND_PORT`  | API port (default: `7000`) |
| `VITE_API_BASE` | API base URL for the frontend (e.g. `http://localhost:7000/api`) |
| `MONGO_URI`     | MongoDB connection string |
| `JWT_SECRET`    | Secret for signing JWTs |
| `JWT_EXPIRES_IN`| Optional token expiry (default: `1d`) |

**Docker:** point `MONGO_URI` at the Compose service, for example:

```env
MONGO_URI=mongodb://db:27017/primetrade
```

**Local MongoDB:**

```env
MONGO_URI=mongodb://localhost:27017/primetrade
```

`VITE_API_BASE` must be reachable from the **browser** (typically `http://localhost:7000/api`), not an internal Docker hostname.

## Quick Start (Docker)

1. Create `.env` from `.env.example` and set `JWT_SECRET` and the variables above.

2. Start all services:

   ```bash
   docker compose up --build
   ```

3. Open the app at [http://localhost:5000](http://localhost:5000) (or your `FRONTEND_PORT`).

4. Register a user. New accounts default to the `user` role. To test admin features, set `role` to `admin` in MongoDB or pass `"role": "admin"` in the register request body.

## Local Development (without Docker)

### Backend

```bash
cd server
npm install
```

Create `server/.env` (or use the root `.env` if you load it the same way) with `MONGO_URI`, `JWT_SECRET`, and `BACKEND_PORT=7000`.

```bash
npm start
```

### Frontend

```bash
cd client
npm install
```

Set `VITE_API_BASE=http://localhost:7000/api` in `.env` at the project root or in `client/.env`.

```bash
npm run dev
```

The Vite dev server runs on port `5000` by default.

## API Reference

Base path: `{VITE_API_BASE}` (e.g. `http://localhost:7000/api`)

### Auth

| Method | Endpoint           | Auth | Description        |
| ------ | ------------------ | ---- | ------------------ |
| POST   | `/auth/register`   | No   | Create account     |
| POST   | `/auth/login`      | No   | Login, returns JWT |

### Products & Orders

| Method | Endpoint            | Auth   | Role   | Description              |
| ------ | ------------------- | ------ | ------ | ------------------------ |
| GET    | `/products`         | No     | —      | List active products     |
| POST   | `/products`         | Bearer | admin  | Create product           |
| PUT    | `/products/:id`     | Bearer | admin  | Update product           |
| DELETE | `/products/:id`     | Bearer | admin  | Delete product           |
| POST   | `/orders`           | Bearer | user   | Place order (`productId`, `quantity`) |

Protected routes expect: `Authorization: Bearer <token>`.

### Health

| Method | Endpoint | Description   |
| ------ | -------- | ------------- |
| GET    | `/`      | Server status |

## User Roles

| Role    | Capabilities                                      |
| ------- | ------------------------------------------------- |
| `admin` | Create, edit, delete products; view catalog       |
| `user`  | View catalog; place orders (stock decremented)    |
| `guest` | Defined in the schema; not used in the current UI |

## Scripts

**Client** (`client/`): `npm run dev`, `npm run build`, `npm run lint`, `npm run preview`

**Server** (`server/`): `npm start` (nodemon)

## License

MIT — see [LICENSE](LICENSE).
