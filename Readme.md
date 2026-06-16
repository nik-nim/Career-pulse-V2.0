# 🚀 CareerPulse - AI-Powered Career Development Platform

[![Python](https://img.shields.io/badge/Python-3.12-blue)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-green)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

**CareerPulse** is a full-stack, AI-powered career development platform that helps job seekers manage their job search, track applications, prepare for interviews, and build professional profiles — all in one dashboard.

![Dashboard](https://img.shields.io/badge/Status-Active-brightgreen)
![Version](https://img.shields.io/badge/Version-2.0-blue)

---

## 📸 Screenshots

| Dashboard | Job Board | AI Tools |
|-----------|-----------|----------|
| Stats, Charts, Quick Actions | Search, Filter, Apply, Scrape | Cover Letter, Mock Interviews |

| Profile | Applications | Daily Tracker |
|---------|--------------|---------------|
| Skills, Resume Upload | Status Pipeline | Mood & Activity Log |

---

## ✨ Features

### 🔐 Authentication
- User registration & login with JWT tokens
- Password hashing with bcrypt
- Persistent sessions via localStorage

### 📊 Dashboard
- Real-time statistics (applications, interviews, jobs, practice hours)
- Application funnel visualization (Applied → Phone Screen → Interview → Offer → Rejected)
- 7-day activity table
- Quick action cards
- Daily summary email notifications

### 💼 Job Board
- Search & filter job listings
- One-click apply
- Live job scraping (Indeed integration)
- Export jobs to CSV/JSON/Print
- Salary range display
- Skill tags

### 👤 Profile Management
- Editable profile fields (name, headline, bio, phone, location, education, links)
- Skill management (add/delete skills)
- Resume upload with automatic skill extraction
- Drag & drop file upload

### 📋 Application Tracker
- Full CRUD for job applications
- Status pipeline (Applied → Phone Screen → Interview → Offer → Rejected)
- Status update via dropdown
- Add new applications manually
- Export to CSV/JSON/Print

### 📅 Interview Scheduler
- Schedule interviews with company, role, date, time
- View all scheduled interviews
- Track interview status
- Export data

### 📊 Daily Tracker
- Log daily job search activity
- Track applications, interviews, practice hours
- Mood tracking (Great, Motivated, Okay, Stressed, Productive)
- Notes field
- 7-day history view
- Export to CSV/JSON/Print

### 🤖 AI Career Tools
- **Cover Letter Generator** - AI-generated cover letters
- **Interview Questions** - Technical, Behavioral, HR question banks
- **Mock Interview** - Simulated interview with tips
- **Resume Tips** - Professional resume writing advice

### 🎨 UI/UX
- Dark/Light mode toggle
- Responsive sidebar navigation
- Toast notifications for all actions
- Print-friendly sections
- Hover effects & smooth transitions

---

## 🏗️ Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                       │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│ │ Dashboard│ │ Job Board│ │ Profile  │ │ AI Tools │         │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘         │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐                      │
│ │Apps Tracker│ Interviews │ │Daily Log │                    │
│ └──────────┘ └──────────┘ └──────────┘                      │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST API
┌──────────────────────┴──────────────────────────────────────┐
│                      Backend (FastAPI)                      │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│ │   Auth   │ │   Jobs   │ │ Profile  │ │    AI    │         │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘         │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐                      │
│ │  Match   │ │ Analytics│ │ Services │                      │
│ └──────────┘ └──────────┘ └──────────┘                      │
└──────────────────────┬──────────────────────────────────────┘
                       │ SQLAlchemy ORM
┌──────────────────────┴──────────────────────────────────────┐
│                Database (SQLite/PostgreSQL)                 │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│ │  Users   │ │   Jobs   │ │   Apps   │ │Interviews│         │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘         │
│ ┌──────────┐ ┌──────────┐                                   │
│ │UserSkills│ │DailyLogs │                                   │
│ └──────────┘ └──────────┘                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18, TypeScript, TailwindCSS, React Router |
| **Backend** | Python 3.12, FastAPI, SQLAlchemy 2.0 |
| **Database** | SQLite (dev), PostgreSQL (prod-ready) |
| **Auth** | JWT, bcrypt, OAuth2 |
| **AI** | OpenAI API (optional), Template-based generation |
| **Scraping** | httpx, BeautifulSoup4 |
| **Notifications** | Email service (simulated for dev) |
| **State** | React hooks, localStorage |
| **Styling** | TailwindCSS, Dark mode |
| **HTTP Client** | Fetch API |

---

## 📁 Project Structure

```text
career-pulse/
├── backend/
│   ├── app/
│   │   ├── api/v1/         # API routes
│   │   │   ├── auth.py     # Login/Register
│   │   │   ├── jobs.py     # Job CRUD + scraping
│   │   │   ├── profile.py  # User profile + skills + resume
│   │   │   ├── match.py    # Job matching
│   │   │   ├── ai.py       # AI tools
│   │   │   └── analytics.py# Analytics
│   │   ├── core/           # Config, database, security
│   │   ├── models/         # SQLAlchemy models
│   │   ├── services/       # Business logic
│   │   └── main.py         # FastAPI app
│   ├── seed_data.py        # Database seeder
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.tsx         # Main application (all pages)
│   │   ├── index.css       # Tailwind + custom styles
│   │   └── main.tsx        # Entry point
│   ├── package.json        # Node dependencies
│   ├── tailwind.config.js
│   └── vite.config.ts
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- Node.js 20+
- npm

### Backend Setup
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
python seed_data.py
uvicorn app.main:app --reload
```
*Backend runs at: `http://localhost:8000`*
*API Docs: `http://localhost:8000/docs`*

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at: `http://localhost:3000`*

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login & get token |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/jobs` | List all jobs |
| POST | `/api/v1/jobs/scrape` | Scrape live jobs |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/profile` | Get user profile |
| PUT | `/api/v1/profile` | Update profile |
| POST | `/api/v1/profile/skills` | Add skill |
| POST | `/api/v1/profile/resume` | Upload resume |
| GET | `/api/v1/profile/applications` | Get applications |
| POST | `/api/v1/profile/applications`| Add application |
| PUT | `/api/v1/profile/applications/{id}`| Update status |
| GET | `/api/v1/profile/interviews` | Get interviews |
| POST | `/api/v1/profile/interviews` | Schedule interview |
| GET | `/api/v1/profile/daily-logs` | Get daily logs |
| POST | `/api/v1/profile/daily-logs` | Save daily log |

### AI Tools
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/ai/cover-letter` | Generate cover letter |
| GET | `/api/v1/ai/interview-questions`| Get interview questions |
| GET | `/api/v1/ai/mock-interview` | Mock interview |
| GET | `/api/v1/ai/resume-tips` | Resume writing tips |

---

## 🗄️ Database Schema

```text
users
├── id (UUID)
├── email (unique)
├── full_name
├── hashed_password
├── headline, bio, phone, location
├── experience_years, education
├── target_role, target_salary
├── linkedin_url, github_url, portfolio_url
├── resume_text
└── created_at, updated_at

user_skills
├── id (UUID)
├── user_id (FK → users)
├── skill_name
└── proficiency

applications
├── id (UUID)
├── user_id (FK → users)
├── job_title, company, location
├── status (Applied/Phone Screen/Interview/Offer/Rejected)
├── applied_date
└── notes

interviews
├── id (UUID)
├── user_id (FK → users)
├── company, role
├── date, time, type
└── status

daily_logs
├── id (UUID)
├── user_id (FK → users)
├── date
├── applications_count, interviews_count
├── practice_hours, mood
└── notes

jobs
├── id (UUID)
├── title, company, location, category
├── description, required_skills (JSON)
├── salary_min, salary_max
├── source, source_url
└── is_active
```

---

## 🎯 Feature Roadmap

### ✅ Completed
- User authentication (register/login)
- Dashboard with stats & charts
- Job board with search & filter
- Application tracker with status pipeline
- Interview scheduler
- Daily activity tracker
- AI cover letter generator
- AI interview questions
- Mock interview simulator
- Resume tips generator
- Resume upload & skill extraction
- Job scraping
- Email notifications (simulated)
- CSV/JSON/Print export
- Dark/Light mode
- Responsive design

### 🚧 In Progress
- Real email integration (SendGrid/SMTP)
- LinkedIn profile import
- Advanced analytics charts
- Job alert system

### 🔮 Future
- AI-powered job matching (embeddings)
- Video interview practice
- AI career coach chatbot
- Mobile PWA
- Multi-language support
- Integration tests
- CI/CD pipeline
- Docker deployment

---

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License
This project is licensed under the MIT License - see the `LICENSE` file for details.

---

## 👤 Author
**Nikhil Nim**

---

## 🙏 Acknowledgments
- FastAPI for the amazing backend framework
- React for the frontend library
- TailwindCSS for the utility-first CSS
- All open-source contributors

*Built with ❤️ for job seekers everywhere.*
