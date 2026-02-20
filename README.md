# 📚 Course Platform API

A full-featured **course selling platform** backend built with **Node.js**, **Express**, and **MongoDB**. Instructors can create courses, upload video lectures via **Cloudinary**, and students can browse, purchase (via **Razorpay**), and watch courses with time-limited signed video URLs.

---

## ✨ Features

- **JWT Authentication** — Signup, login, and token-based session management
- **Role-Based Access** — Three roles: `student`, `instructor`, `superadmin`
- **Instructor Dashboard** — Create / update / delete courses with thumbnail uploads
- **Lecture Management** — Upload video lectures (up to 500 MB) to Cloudinary
- **Course Publishing** — Toggle publish/unpublish to control visibility
- **Razorpay Payments** — Create and verify payment orders; free course enrollment supported
- **Signed Video URLs** — Cloudinary signed URLs with 1-hour expiry for secure streaming
- **Preview Lectures** — Mark lectures as free previews for unauthenticated browsing
- **Input Validation** — Request validation with **Zod**
- **CORS** — Pre-configured for frontend at `localhost:5173`

---

## 🗂️ Project Structure

```
course/
├── config/
│   ├── couldinary.js      # Cloudinary SDK configuration
│   ├── db.js              # MongoDB connection (Mongoose)
│   └── rozarpay.js        # Razorpay SDK instance
├── controllers/
│   ├── instructor/
│   │   └── instructor.js  # Course & lecture CRUD for instructors
│   └── user/
│       ├── auth.js        # Signup, login, request-instructor
│       ├── coursecon.js    # Browse courses, watch lectures
│       └── purchase.js    # Create & verify Razorpay orders
├── database/
│   ├── course.js          # Course model
│   ├── lecture.js         # Lecture model
│   ├── order.js           # Order / purchase model
│   └── user.js            # User model
├── middleware/
│   └── auth.js            # isAuth, isInstructor, isAdmin guards
├── routes/
│   ├── authroute.js       # /api/auth routes
│   ├── userroute.js       # /api/user routes
│   └── instructorroute.js # /api/instructor routes
├── .env                   # Environment variables
├── index.js               # Entry point
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** (Atlas or local)
- **Cloudinary** account
- **Razorpay** account (test or live keys)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd course
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

### 3. Run the Server

```bash
# Development (auto-reload with nodemon)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000`.

---

## 📡 API Reference

### Authentication — `/api/auth`

| Method | Endpoint              | Auth | Description                        |
|--------|-----------------------|------|------------------------------------|
| POST   | `/signup`             | ❌   | Register a new student account     |
| POST   | `/login`              | ❌   | Login and receive a JWT token      |
| POST   | `/request-instructor` | ✅   | Request instructor role upgrade    |

### User / Student — `/api/user`

| Method | Endpoint                    | Auth | Description                              |
|--------|-----------------------------|------|------------------------------------------|
| GET    | `/courses`                  | ❌   | List all courses                         |
| GET    | `/courses/:id`              | ❌   | Get single course details                |
| GET    | `/courses/:id/watch`        | ✅   | Watch a lecture (signed URL, 1hr expiry) |
| POST   | `/purchase/create-order`    | ✅   | Create a Razorpay order / free enroll    |
| POST   | `/purchase/verify-order`    | ✅   | Verify Razorpay payment signature        |

### Instructor — `/api/instructor`

> All routes require **login + instructor role**.

| Method | Endpoint                          | Description                     |
|--------|-----------------------------------|---------------------------------|
| GET    | `/courses`                        | List instructor's own courses   |
| POST   | `/courses`                        | Create a new course (+ thumbnail) |
| PUT    | `/courses/:id`                    | Update course details           |
| DELETE | `/courses/:id`                    | Delete course & all its lectures |
| PATCH  | `/courses/:id/publish`            | Toggle publish / unpublish      |
| GET    | `/courses/:id/lectures`           | List lectures for a course      |
| POST   | `/courses/:id/lectures`           | Add a lecture (video upload)    |
| DELETE | `/courses/:id/lectures/:lectureId`| Delete a lecture                |

---

## 🗄️ Database Models

### User
| Field        | Type     | Description                                  |
|-------------|----------|----------------------------------------------|
| `name`      | String   | Full name (required)                         |
| `email`     | String   | Unique email (required)                      |
| `password`  | String   | Bcrypt-hashed password                       |
| `role`      | String   | `student` / `instructor` / `superadmin`      |
| `instructor`| String   | Request status: `none` / `pending` / `approved` / `rejected` |

### Course
| Field               | Type     | Description                         |
|--------------------|----------|-------------------------------------|
| `title`            | String   | Course title (required)             |
| `description`      | String   | Course description (required)       |
| `price`            | Number   | Price in INR (0 = free)             |
| `thumbnail`        | String   | Cloudinary image URL                |
| `instructor`       | ObjectId | Reference to User                   |
| `totalLectures`    | Number   | Auto-incremented lecture count      |
| `isPublished`      | Boolean  | Visibility toggle                   |

### Lecture
| Field        | Type     | Description                          |
|-------------|----------|--------------------------------------|
| `title`     | String   | Lecture title (required)             |
| `description`| String  | Optional description                 |
| `videourl`  | String   | Cloudinary video URL                 |
| `public_id` | String   | Cloudinary asset ID (for signed URLs)|
| `order`     | Number   | Display order                        |
| `isPreview` | Boolean  | Free preview flag                    |
| `duration`  | Number   | Duration in seconds                  |
| `course`    | ObjectId | Reference to Course                  |

### Order
| Field     | Type     | Description                          |
|----------|----------|--------------------------------------|
| `user`   | ObjectId | Reference to User                    |
| `course` | ObjectId | Reference to Course                  |
| `payment`| String   | Razorpay payment ID or `"free"`      |

---

## 🔐 Authentication & Authorization

1. **JWT Tokens** — Issued on login with 7-day expiry; sent as `Bearer <token>` in the `Authorization` header.
2. **Middleware Guards:**
   - `isAuth` — Verifies JWT and attaches `req.user`
   - `isInstructor` — Requires `role === "instructor"`
   - `isAdmin` — Requires `role === "superadmin"`

---

## 💳 Payment Flow

```
Student                     Server                    Razorpay
  │                           │                          │
  ├─ POST /create-order ─────►│                          │
  │                           ├─ orders.create() ───────►│
  │                           │◄─── orderId ─────────────┤
  │◄── { orderId } ──────────┤                          │
  │                           │                          │
  │── (Razorpay checkout) ───────────────────────────────►│
  │◄── payment_id, signature ────────────────────────────┤
  │                           │                          │
  ├─ POST /verify-order ─────►│                          │
  │                           ├─ HMAC verify ────────────┤
  │                           ├─ Create order record     │
  │◄── { success } ──────────┤                          │
```

Free courses (price = 0) skip Razorpay and enroll directly.

---

## 📦 Dependencies

| Package        | Purpose                                    |
|---------------|--------------------------------------------|
| `express`     | Web framework                              |
| `mongoose`    | MongoDB ODM                                |
| `bcrypt`      | Password hashing                           |
| `jsonwebtoken`| JWT authentication                         |
| `cloudinary`  | Media storage (images & videos)            |
| `multer`      | Multipart form-data / file upload handling |
| `razorpay`    | Payment gateway integration                |
| `zod`         | Schema validation                          |
| `cors`        | Cross-origin resource sharing              |
| `dotenv`      | Environment variable management            |
| `crypto`      | HMAC signature verification                |
| `nodemon`     | Dev auto-restart (devDependency)           |

---

## 📝 License

ISC
