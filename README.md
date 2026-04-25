# 🏥 MediGrid: Hospital Resource Management System

MediGrid is a high-performance, real-time dashboard for managing city-wide hospital resources. Built for Pune, India, it provides critical insights into bed availability, ventilator status, and emergency alerts.

## 🚀 Features

- **Real-time Monitoring**: Track bed and ventilator availability across 6 city zones.
- **Role-Based Access Control (RBAC)**: Specialized views for System Admins, Hospital Admins, and City Authorities.
- **Auto-Triggering Alerts**: Instant notifications when resources fall below configurable thresholds.
- **Analytics Dashboard**: Visual representation of city-wide utilization trends with CSV export.
- **Public Search**: Find available resources by zone or type with distance-based ranking.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, Recharts.
- **Backend**: Flask, PostgreSQL, SQLAlchemy, Flask-Migrate, JWT, Bcrypt.
- **Infrastructure**: Docker & Docker Compose.

## 📦 Setup & Installation

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local frontend development)

### Quick Start (Docker)

1. Clone the repository.
2. Run `docker-compose up --build`.
3. Access the frontend at `http://localhost:5173` (if serving locally) or via the configured container.
   *Note: Ensure the backend is running at `http://localhost:5000`.*

### Manual Setup

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your PostgreSQL credentials
flask db init
flask db migrate -m "initial schema"
flask db upgrade
python seed.py
python run.py
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 👥 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **System Admin** | `admin@medigrid.in` | `Admin@1234` |
| **Hospital Admin** | `priya.rao@citygeneral.in` | `Hospital@123` |
| **Emergency Operator** | `rohan.s@punepolice.in` | `Operator@123` |
| **City Authority** | `kavita@punecity.gov.in` | `Authority@123` |

---

*Part of the Advanced Agentic Coding project.*
