# Service Request — Python Version

Full-stack Service Request application using React, Python Flask, SQLAlchemy, and PostgreSQL.

## Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs at `http://localhost:5173`

## Backend
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
flask --app app db upgrade
python app.py
```
Runs at `http://localhost:5000`

## Database Migration
Initial setup:
```bash
cd backend
flask --app app db upgrade
```
After model changes:
```bash
flask --app app db migrate -m "describe change"
flask --app app db upgrade
```

## API Endpoints
- `POST /api/service-requests` — validate and create a request in PostgreSQL; returns `201`.
- `GET /api/service-requests` — fetch all requests, newest first; returns `200`.
- `GET /api/health` — backend health check; returns `200`.

## Database
PostgreSQL database: `service_requests`

Copy `backend/.env.example` to `backend/.env` and set your PostgreSQL password.

## Flow
React Form → POST API → Python Flask → Validation → SQLAlchemy → PostgreSQL → API Response → React UI

No authentication is used.
