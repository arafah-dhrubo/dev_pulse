# Dev Pulse

> **Live URL:** [Insert Live URL Here]

Dev Pulse is a robust, role-based issue tracking API designed to handle bug reports and feature requests efficiently. It enforces strict access controls, data validation, and uses raw SQL to ensure maximum database performance without the overhead of ORMs.

## 🚀 Features
- **Secure Authentication:** JWT-based login and registration with securely hashed passwords using `bcrypt`.
- **Role-Based Access Control (RBAC):** Distinct permissions for `contributor` (can create and view issues, and delete their own) and `maintainer` (full administrative rights over all issues).
- **Issue Tracking:** Create, read, update, and delete issues with structured types (`bug`, `feature_request`) and statuses (`open`, `in_progress`, `resolved`).
- **Query & Filtering:** Robust filtering for issues based on type, status, and chronological sorting.
- **Raw SQL Performance:** Uses the native `pg` driver to communicate directly with PostgreSQL.

## 🛠 Tech Stack
- **Runtime:** Node.js (LTS, 24.x+)
- **Language:** TypeScript
- **Framework:** Express.js (Modular router architecture)
- **Database:** PostgreSQL (Native `pg` driver, Raw SQL only)
- **Security:** `jsonwebtoken` (JWT), `bcrypt` (Password hashing)

## ⚙️ Setup Steps

### 1. Prerequisites
- Node.js (v24.x or higher)
- PostgreSQL installed and running locally.

### 2. Installation
Clone the repository and install the required dependencies:
```bash
git clone <repository-url>
cd dev_pulse
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and configure the following variables:
```env
PORT=""
DATABASE_URL=""
JWT_SECRET=""
```

### 4. Database Initialization
The application will automatically initialize the required tables (`accounts` and `issues`) on startup. Ensure your PostgreSQL instance has a database matching the `DB_NAME` variable.

### 5. Running the Application
**Development Mode:**
```bash
npm run start
```
The server will start on `http://localhost:3000`.

## 🔌 API Endpoint List

All `/api/issues/*` routes require a valid JWT token passed in the `Authorization: Bearer <token>` header.

### Accounts
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/account/signup` | Register a new user | Public |
| POST | `/api/account/login` | Authenticate and receive a JWT | Public |

### Issues
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/issues` | Get all issues (supports `?sort=`, `?type=`, `?status=`) | Authenticated |
| GET | `/api/issues/:id` | Get details of a specific issue | Authenticated |
| POST | `/api/issues` | Create a new issue | Authenticated |
| PATCH | `/api/issues/:id` | Update an existing issue | Authenticated |
| DELETE | `/api/issues/:id` | Delete an issue | Maintainer / Original Reporter |

## 🗄 Database Schema Summary

The application uses the following relational tables:

### `accounts`
Stores user credentials and roles.
- `id`: SERIAL PRIMARY KEY
- `name`: VARCHAR(100) NOT NULL
- `email`: VARCHAR(255) UNIQUE NOT NULL
- `password_hash`: VARCHAR(255) NOT NULL
- `role`: VARCHAR(20) DEFAULT 'contributor' (`contributor`, `maintainer`)
- `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### `issues`
Stores issue details, linked to the reporter.
- `id`: SERIAL PRIMARY KEY
- `title`: VARCHAR(150) NOT NULL
- `description`: TEXT NOT NULL
- `type`: VARCHAR(20) NOT NULL (`bug`, `feature_request`)
- `status`: VARCHAR(20) DEFAULT 'open' (`open`, `in_progress`, `resolved`)
- `reporter_id`: INT (Foreign Key referencing `accounts(id)`)
- `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `updated_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
