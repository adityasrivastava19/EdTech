# EdTech Platform for SyntaxSchool

> **Founded by Aditya**

A comprehensive Node.js backend application for managing online courses with integrated payment processing, video hosting, and role-based access control. Built as the foundation for SyntaxSchool's EdTech platform.

## 📋 Overview

This backend system provides a foundation for an online course platform with support for:
- **User Management** - Student, Instructor, and SuperAdmin roles
- **Course Management** - Course creation, video uploads, and management
- **Payment Integration** - Razorpay payment gateway support
- **Media Storage** - Cloudinary integration for video hosting
- **Order Management** - Track course purchases and enrollments

---

## 🚀 Features

### User System
- **Multi-role Authentication**: Students, Instructors, and SuperAdmins
- **Instructor Applications**: Workflow for users to become instructors (pending/approved/rejected)
- **Secure Password Storage**: Using bcrypt for password hashing

### Course Management
- Course creation with title, description, and pricing
- Video upload and management via Cloudinary
- Instructor assignment for courses
- Timestamps for course tracking

### Payment Processing
- Razorpay integration for secure payments
- Order tracking linked to users and courses
- Payment verification system

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB** | Database (via Mongoose) |
| **Cloudinary** | Video/media storage |
| **Razorpay** | Payment gateway |
| **JWT** | Authentication tokens |
| **Bcrypt** | Password hashing |
| **Zod** | Schema validation |
| **Multer** | File upload handling |

---

## 📁 Project Structure

```
course/
├── config/
│   ├── db.js              # MongoDB connection
│   ├── couldinary.js      # Cloudinary configuration
│   └── rozarpay.js        # Razorpay configuration
├── database/
│   ├── user.js            # User schema & model
│   ├── course.js          # Course schema & model
│   └── order.js           # Order schema & model
├── routes/
│   └── authroute.js       # Authentication routes (skeleton)
├── .env                   # Environment variables
├── package.json           # Dependencies
└── package-lock.json      # Dependency lock file
```

---

## 📦 Installation

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (local or cloud instance)
- **Cloudinary Account** (for video hosting)
- **Razorpay Account** (for payment processing)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd course
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Database
   MONGO_URL=your_mongodb_connection_string
   
   # Cloudinary
   CLOUD_NAME=your_cloudinary_cloud_name
   API_KEY=your_cloudinary_api_key
   API_SECRET=your_cloudinary_api_secret
   
   # Razorpay
   KEY_ID=your_razorpay_key_id
   KEY_SECRET=your_razorpay_key_secret
   
   # JWT (add if needed)
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   *Note: A main server file (e.g., `index.js` or `server.js`) needs to be created*

---

## 📊 Database Schemas

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['student', 'instructor', 'superadim'], default: 'student'),
  instructor: String (enum: ['none', 'pending', 'approved', 'rejected'], default: 'none'),
  timestamps: true
}
```

### Course Schema
```javascript
{
  tittle: String (required),
  description: String (required),
  price: Number (required),
  videourl: String (required),
  public_id: String (required),
  instructor: ObjectId (ref: 'user', required),
  timestamps: true
}
```

### Order Schema
```javascript
{
  user: ObjectId (ref: 'user', required),
  course: ObjectId (ref: 'course', required),
  payment: String (required),
  timestamps: true
}
```

---

## 🔧 Configuration Files

### Database Configuration (`config/db.js`)
Handles MongoDB connection using Mongoose with async/await pattern.

### Cloudinary Configuration (`config/couldinary.js`)
Configures Cloudinary SDK for video upload and management.

### Razorpay Configuration (`config/rozarpay.js`)
Initializes Razorpay instance with API credentials.

---

## ⚠️ Known Issues & TODO

> [!WARNING]
> **Critical Issues Found**

1. **Missing Server Entry Point** - No `index.js` or `server.js` file to start the application
2. **Incomplete Routing** - `authroute.js` is a skeleton with no routes defined
3. **Missing Exports** - `order.js` doesn't export the model

> [!CAUTION]
> **Code Errors**

1. **Typo in Variable Name** - `couldinary.js` should be `cloudinary.js` (file name typo)
2. **Typo in Role** - User schema has `"superadim"` instead of `"superadmin"`
3. **Wrong Method** - `course.js` uses `mongoose.courseSchema` instead of `mongoose.Schema`
4. **Missing Quote** - `course.js` line 3: `require(mongoose)` should be `require('mongoose')`
5. **Wrong Property** - `course.js` line 26: `mongoose.Types.Schema.ObjectId` should be `mongoose.Schema.Types.ObjectId`
6. **Unused Imports** - `zod/mini` imported but not used in `course.js` and `order.js`

> [!IMPORTANT]
> **Missing Functionality**
- No authentication middleware
- No API route handlers
- No error handling
- No input validation (Zod is installed but not used)
- No JWT token generation/verification
- No file upload routes (Multer installed but not configured)

---

## 🎯 Next Steps (Recommendations)

### Phase 1: Fix Critical Issues ✅
- [ ] Create `index.js` or `server.js` as main entry point
- [ ] Fix typos in code (schema, variable names, require statements)
- [ ] Export Order model properly
- [ ] Set up Express server with CORS and middleware

### Phase 2: Implement Core Features
- [ ] Create authentication routes (signup, login, logout)
- [ ] Implement JWT middleware for protected routes
- [ ] Add course CRUD operations
- [ ] Implement file upload with Multer + Cloudinary
- [ ] Create Razorpay payment routes
- [ ] Add Zod validation schemas

### Phase 3: Enhancement
- [ ] Add error handling middleware
- [ ] Implement logging
- [ ] Add rate limiting
- [ ] Write API documentation
- [ ] Add unit tests
- [ ] Set up development and production environments

---

## 🔐 Security Considerations

- Passwords are hashed using **bcrypt** before storage
- Environment variables should **never** be committed to version control
- JWT tokens should be used for stateless authentication
- API routes should implement proper authorization checks
- Input validation is critical for preventing injection attacks

---

## 📝 API Endpoints (Planned)

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create new course (Instructor only)
- `GET /api/courses/:id` - Get course details
- `PUT /api/courses/:id` - Update course (Instructor only)
- `DELETE /api/courses/:id` - Delete course (Instructor/Admin only)

### Orders
- `POST /api/orders/create` - Create payment order
- `POST /api/orders/verify` - Verify payment
- `GET /api/orders/user/:userId` - Get user's orders

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/instructor-request` - Request instructor status

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

ISC License

---

## 👥 Author

**Aditya** - Founder & Developer - [SyntaxSchool](https://github.com/adityasrivastava19)

---

## 🙏 Acknowledgments

- Express.js for the robust web framework
- MongoDB for the flexible database
- Cloudinary for media management
- Razorpay for payment processing solutions

---

**Status**: 🚧 Under Development - This is a foundational setup requiring implementation of core features.
