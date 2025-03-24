Here’s a detailed and polished `README.md` tailored to your full-stack authentication and checkout project, based on all the files you uploaded:

---

# AuthFlow – Full-Stack Authentication & Checkout System

AuthFlow is a full-stack authentication system built with **Next.js** that supports:
- ✅ Email/password login via verification codes
- 🔐 JWT-based session management
- 🔗 Google OAuth 2.0 sign-in
- 💳 Stripe checkout integration (embedded)

---

## 🧩 Features

### Authentication
- Sign in / Sign up with **email verification codes**
- Sign in with **Google OAuth**
- Secure token management with **access** and **refresh tokens** using **JWT**
- Token verification and silent **refresh mechanism**

### Payments
- Embedded **Stripe Checkout** experience
- Session status tracking and post-checkout confirmation page

### Email Integration
- Email verification via **Mailgun SMTP** (using **nodemailer**)

---

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router), React
- **Backend**: Node.js API Routes
- **Database**: MongoDB (via native driver)
- **Auth**: JWT, Google OAuth, Mailgun (email verification)
- **Payments**: Stripe API (embedded checkout)

---

## 📁 Project Structure

```
/api
  └── auth/
      ├── verifyToken.js           # Verifies/refreshes JWTs
      ├── googleAuth.js            # Handles Google OAuth flow
      ├── login.js                 # Sends verification email
      ├── verifyLoginCode.js       # Verifies email login code & issues tokens
      └── logout.js                # Clears tokens
  └── checkoutSessions.js         # Creates Stripe checkout session

/server
  ├── mongodb.js                  # MongoDB connection helper
  ├── oauth/googleLink.js         # Generates Google OAuth URL
  └── email/
      ├── sendEmailVerification.js# Sends verification email
      └── nodeMailTransporter.js  # Nodemailer Mailgun transporter

/pages
  ├── index.jsx                   # Home with logout option
  ├── signin.jsx                  # Sign-in/Sign-up with verification code
  ├── checkout.jsx                # Embedded Stripe checkout
  └── return.jsx                  # Post-checkout status page
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root of your project and configure:

```
# MongoDB
MONGO_URI=your_mongodb_connection_string

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_SECRET_ID=your_google_client_secret
NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URL=http://localhost:3000/api/auth/googleAuth

# JWT Secret Keys
JWT_SECRET_KEY=your_jwt_secret
JWT_REFRESH_SECRET_KEY=your_refresh_jwt_secret

# Mailgun SMTP (for nodemailer)
MAILGUN_SMTP_USER=your_mailgun_smtp_user
MAILGUN_SMTP_PASS=your_mailgun_smtp_pass

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

---

## 🚀 Getting Started

1. **Install dependencies**  
   ```bash
   npm install
   ```

2. **Run the development server**  
   ```bash
   npm run dev
   ```

3. **Open the app**  
   Visit [http://localhost:3000](http://localhost:3000)

---

## 🛡️ Security Overview

- Passwordless authentication via **verification codes**.
- **Tokens** securely stored in **cookies** with appropriate flags:
  - `HttpOnly`, `Secure`, `SameSite=Strict`
- Expiry:
  - Access Token: 1 hour
  - Refresh Token: 7 days
- **Email verification codes** expire after 15 minutes with 5 attempts.

---

## 📧 Email Verification Flow

1. User enters their email.
2. Server generates a **5-digit code**.
3. Code is sent via **Mailgun** (SMTP using nodemailer).
4. User inputs the code to complete authentication.
5. Upon success, JWT tokens are issued.

---

## 💳 Stripe Checkout Flow

1. User initiates checkout → Embedded Stripe checkout loads.
2. Session is created via `/api/checkoutSessions`.
3. After payment:
   - User redirected to `/return`
   - Status fetched, confirmation shown


