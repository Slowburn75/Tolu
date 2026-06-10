# Tolumak - Premium Fashion E-Commerce Platform

A full-stack, production-ready e-commerce platform for fashion retail built with modern web technologies.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Shadcn UI |
| **Backend** | NestJS, TypeScript, Prisma ORM |
| **Database** | Neon PostgreSQL |
| **Auth** | JWT (Access + Refresh Tokens) |
| **Storage** | Cloudinary |
| **Payments** | Paystack, Flutterwave |
| **Deployment** | Vercel (frontend), Railway/Render (backend) |

## Architecture

```
tolumak/
├── backend/                    # NestJS API server
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── seed.ts             # Seed data
│   └── src/
│       ├── main.ts             # Entry point
│       ├── app.module.ts       # Root module
│       ├── config/             # Configuration
│       ├── prisma/             # Prisma service
│       ├── common/             # Guards, decorators, filters
│       └── modules/
│           ├── auth/           # Authentication & authorization
│           ├── users/          # User management
│           ├── products/       # Product CRUD & search
│           ├── categories/     # Category management
│           ├── brands/         # Brand management
│           ├── cart/           # Shopping cart
│           ├── wishlist/       # Wishlist
│           ├── orders/         # Order management
│           ├── payments/       # Paystack & Flutterwave
│           ├── coupons/        # Discount coupons
│           ├── reviews/        # Product reviews
│           ├── uploads/        # Cloudinary image uploads
│           ├── admin/          # Admin dashboard
│           ├── dashboard/      # Dashboard statistics
│           └── newsletter/     # Newsletter subscriptions
│
└── frontend/                   # Next.js client
    └── src/
        ├── app/
        │   ├── (store)/        # Public storefront pages
        │   │   ├── shop/
        │   │   ├── products/[slug]/
        │   │   ├── cart/
        │   │   ├── checkout/
        │   │   └── ...
        │   ├── (auth)/         # Authentication pages
        │   │   ├── login/
        │   │   ├── register/
        │   │   ├── forgot-password/
        │   │   └── reset-password/
        │   ├── (dashboard)/    # User dashboard
        │   │   └── dashboard/
        │   │       ├── orders/
        │   │       ├── wishlist/
        │   │       ├── addresses/
        │   │       ├── profile/
        │   │       └── password/
        │   └── (admin)/        # Admin panel
        │       └── admin/
        │           ├── products/
        │           ├── categories/
        │           ├── orders/
        │           ├── customers/
        │           ├── coupons/
        │           ├── reviews/
        │           ├── banners/
        │           └── ...
        ├── components/
        │   ├── ui/             # Shadcn UI primitives
        │   ├── layout/         # Navbar, Footer, Sidebars
        │   ├── product/        # Product cards, filters, gallery
        │   ├── cart/           # Cart drawer, items
        │   ├── checkout/       # Checkout forms, payment
        │   ├── home/           # Homepage sections
        │   └── admin/          # Admin components
        ├── hooks/              # React hooks & Zustand stores
        ├── lib/                # API client, utils, constants
        ├── types/              # TypeScript interfaces
        └── providers/          # Context providers
```

## Features

### Customer Storefront
- Homepage with hero banners, categories, new arrivals, best sellers, and collections
- Shop page with advanced filtering (category, gender, price, size, color, brand)
- Product detail pages with image gallery, size/color selectors, reviews
- Shopping cart with guest and logged-in user support
- Complete checkout flow with multiple payment options
- Wishlist management
- Order tracking
- Responsive, mobile-first design

### User Dashboard
- Order history and details
- Order tracking and cancellation
- Address management
- Profile settings
- Password management
- Wishlist management
- Invoice downloads

### Admin Dashboard
- Real-time dashboard with revenue, orders, customers, and sales charts
- Product management with bulk image upload, variants, and stock tracking
- Category and brand management
- Order management with status workflow and tracking
- Customer management
- Coupon system with usage limits
- Review moderation
- Banner management
- Newsletter subscriber management

## Database Schema

- **User** - Account management, authentication, addresses
- **Product** - Full product data with images, variants, categories
- **Category** - Hierarchical category structure (parent/child)
- **Brand** - Product brands
- **Cart / CartItem** - Shopping cart with guest support
- **Wishlist / WishlistItem** - User wishlists
- **Order / OrderItem** - Complete order lifecycle with 10 statuses
- **Payment** - Multi-provider payment tracking
- **Address** - Multiple addresses per user
- **Coupon** - Discount codes with validation
- **Review** - Product ratings and reviews with moderation
- **Banner** - Homepage hero banners
- **NewsletterSubscriber** - Email subscription management
- **InventoryLog** - Stock change tracking

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL (or Neon account for cloud database)
- Paystack account (test keys)
- Flutterwave account (test keys)
- Cloudinary account

### 1. Clone & Install

```bash
# Clone the repository
git clone <repo-url> && cd tolumak

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Environment Variables

**Backend** (`backend/.env`):
```env
DATABASE_URL="postgresql://user:password@host:5432/tolumak"
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
PAYSTACK_SECRET_KEY="sk_test_..."
PAYSTACK_PUBLIC_KEY="pk_test_..."
FLUTTERWAVE_SECRET_KEY="FLWSECK_TEST-..."
FLUTTERWAVE_PUBLIC_KEY="FLWPUBK_TEST-..."
CLOUDINARY_CLOUD_NAME="your-cloud"
CLOUDINARY_API_KEY="your-key"
CLOUDINARY_API_SECRET="your-secret"
FRONTEND_URL="http://localhost:3000"
BACKEND_URL="http://localhost:4000"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
PORT="4000"
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_PAYSTACK_KEY=pk_test_...
NEXT_PUBLIC_FLUTTERWAVE_KEY=FLWPUBK_TEST-...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud
```

### 3. Database Setup

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed the database
npx prisma db seed
```

### 4. Run the Application

```bash
# Terminal 1 - Backend
cd backend && npm run start:dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### 5. Access the Application

- **Storefront**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **API**: http://localhost:4000/api

### Default Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@tolumak.com | Admin123! |
| **User** | user@tolumak.com | User1234! |

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| POST | `/api/auth/refresh` | Refresh tokens |
| POST | `/api/auth/verify-email` | Verify email |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password |
| GET | `/api/auth/me` | Get current user |
| PATCH | `/api/auth/me` | Update profile |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (filtered, paginated) |
| GET | `/api/products/featured` | Featured products |
| GET | `/api/products/new-arrivals` | New arrivals |
| GET | `/api/products/best-sellers` | Best sellers |
| GET | `/api/products/sale` | Sale products |
| GET | `/api/products/:slug` | Product details |

### Cart (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get cart |
| POST | `/api/cart/items` | Add item |
| PATCH | `/api/cart/items/:id` | Update item |
| DELETE | `/api/cart/items/:id` | Remove item |

### Orders (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order |
| GET | `/api/orders/me` | My orders |
| GET | `/api/orders/:id` | Order details |

### Admin Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/products` | Create product |
| PATCH | `/api/admin/products/:id` | Update product |
| DELETE | `/api/admin/products/:id` | Archive product |
| GET | `/api/admin/orders` | All orders |
| PATCH | `/api/admin/orders/:id/status` | Update order status |
| GET | `/api/admin/dashboard` | Dashboard stats |
| GET | `/api/admin/customers` | Customer list |
| GET | `/api/admin/analytics` | Analytics data |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/paystack/initialize` | Initialize Paystack |
| POST | `/api/payments/paystack/verify` | Verify Paystack |
| POST | `/api/payments/flutterwave/initialize` | Initialize Flutterwave |
| POST | `/api/payments/flutterwave/verify` | Verify Flutterwave |
| POST | `/api/payments/webhook/paystack` | Paystack webhook |
| POST | `/api/payments/webhook/flutterwave` | Flutterwave webhook |

## Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy via Vercel CLI or GitHub import
```

### Backend (Railway/Render)
```bash
cd backend
npm run build
# Deploy via Railway/Render with Node environment
```

### Database (Neon)
- Create a Neon project
- Copy the connection string to `DATABASE_URL`
- Run migrations: `npx prisma migrate deploy`

## Design System

- **Fonts**: Inter (body), Playfair Display (headings)
- **Colors**: Black/White primary, warm gray neutrals, amber/gold accents
- **Style**: Minimal, premium, fashion-focused with large imagery and clean spacing
- **Responsive**: Mobile-first design across all pages
