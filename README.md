# Test Application for Testers

This is a full-stack web application built with Express.js, a UI, an API, a local PostgreSQL database, and Docker. All business logic and endpoints are described in `test-brief.pdf`.

## Features
- Express.js backend with REST API
- Simple frontend UI
- PostgreSQL database
- Dockerized for easy local development

## How to Ship and Run Locally

### Requirements
- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed

### Steps
1. Clone or download this repository to your local machine.
2. Make sure the `uploads` directory exists in the project root. If not, create it (it can be empty).
3. Open a PowerShell terminal in the project directory.
4. Run:
   ```powershell
   docker-compose up --build
   ```
5. Open your browser and go to [http://localhost:3000](http://localhost:3000)

To stop the app, press `Ctrl+C` in the terminal and then run:
```powershell
docker-compose down
```

---

### Running Locally (without Docker)
1. Start PostgreSQL locally and update `.env` if needed.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the app:
   ```sh
   node src/index.js
   ```

## Project Structure
- `src/index.js` - Main Express app
- `src/routes/api.js` - API endpoints
- `src/db/` - Database connection
- `src/ui/` - Frontend UI

## Customization
- Update business logic and endpoints as described in `test-brief.pdf`.

---

For more details, see `test-brief.pdf`.
