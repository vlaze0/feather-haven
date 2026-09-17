# 🦜 Feather Haven — Dynamic Bird Shop & Aviary E-Commerce Platform

Feather Haven is a modern, responsive, production-ready full-stack dynamic e-commerce web application designed specifically for bird shops, aviaries, and pet supply stores.

---

## 🌟 Key Features & Highlights

### 🐦 1. Individual Live Bird Inventory Engine
- **Unique Bird Tracking**: Every bird has a unique reference code (e.g. `BIRD-101`), species tag, color mutation, exact age, gender, temperament, vet check status, and health certificate info.
- **Double-Purchase Prevention**: Uses atomic Prisma database transactions (`$transaction`). When a customer purchases a bird marked `AVAILABLE`, its status is updated to `SOLD` atomically. Concurrent checkouts for the same bird automatically abort with a friendly notification.

### 🛍️ 2. Comprehensive Pet Store Catalog
- **Bird Cages Store**: Small, medium, dome top, breeding mansion, travel carriers, and garden aviaries.
- **Bird Food & Nutrition**: Triple-cleaned seed mixes, golden millet harvest sprays, organic daily pellets, cuttlefish calcium bones, and vitamin drops.
- **Accessories & Toys**: Interactive wooden ladder swings, natural grapevine perches, nesting boxes, spill-proof feeders, and bird bath spa containers.

### 💡 3. Smart Recommendations & Bundle Cross-Selling
- **"Recommended for Your Bird"**: Automatically displays suitable cages, seed mixes, cuttlefish bones, and perches whenever a user views a specific bird.
- **"Frequently Bought Together"**: 1-click starter bundle engine (e.g., Budgie + Dome Cage + Master Seed Mix).

### 💬 4. Dynamic WhatsApp Integration
- Floating WhatsApp support button present across all pages.
- Dynamic enquiry message generator: Clicking "Enquire on WhatsApp" on any bird or product page automatically pre-fills a personalized enquiry with the item name, reference code, and price in ₹ (INR).
- Editable WhatsApp phone number directly from the Admin Panel.

### 🛒 5. Dynamic Cart, Wishlist & Coupons
- Persistent Cart & Wishlist stored across browser reloads.
- Home Delivery vs Store Pickup options with dynamic delivery fee calculations (FREE delivery above ₹1,999).
- Voucher Coupon system supporting percentage or fixed discounts (e.g. `WELCOME10`, `FEATHER200`).

### ⚙️ 6. Powerful Admin Dashboard (`/admin`)
- **Overview Metrics**: Real-time sales revenue, total orders, registered customers, live vs sold birds, and low-inventory warnings.
- **Bird Management**: Add, edit, delete birds, change pricing, upload images, and update status (`AVAILABLE`, `RESERVED`, `SOLD`, `COMING_SOON`).
- **Product Management**: Manage cages, food, and accessories with stock thresholds.
- **Order Fulfillment**: Track and update customer orders (`PENDING` -> `CONFIRMED` -> `PREPARING` -> `SHIPPED` -> `DELIVERED`).
- **Dynamic Store Settings**: Edit hero titles, banners, WhatsApp support number, and store address without touching source code.
- **Review Approvals & Coupons**: Approve customer reviews and launch discount vouchers.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS, Lucide Icons, Framer Motion
- **Database & ORM**: Prisma ORM with SQLite (Local Development out-of-the-box) / PostgreSQL ready
- **Authentication**: Custom JWT Authentication with HTTP-only Cookies & bcryptjs password hashing
- **State Management**: React Context API + LocalStorage Sync

---

## 🚀 Quick Start & Local Setup Instructions

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure your `.env` contains:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="feather-haven-super-secret-jwt-key-2026"
NEXTAUTH_SECRET="feather-haven-super-secret-jwt-key-2026"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
WHATSAPP_NUMBER="919876543210"
```

### 3. Initialize Database & Seed Demo Data
Run Prisma schema migration and database seeding:
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 4. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Credentials for Testing

### 👑 Admin Account
- **URL**: [http://localhost:3000/login](http://localhost:3000/login) (redirects to `/admin`)
- **Email**: `admin@aviary.com`
- **Password**: `admin123`

### 👤 Customer Demo Account
- **URL**: [http://localhost:3000/login](http://localhost:3000/login) (redirects to `/account`)
- **Email**: `customer@aviary.com`
- **Password**: `user123`

---

## 📦 Database Entity Overview

- `User`: Customers and Admins with bcrypt password hashes
- `Bird`: Unique live animal tracking records (`birdCode`, `species`, `color`, `age`, `gender`, `price`, `status`, `healthStatus`, `images`)
- `Category` & `Product`: Cages, Food, Toys, Accessories with `ProductImage` relations
- `Order` & `OrderItem`: Customer orders, delivery method, payment status, fulfillment steps
- `Coupon`: Voucher codes with min order & max discount limits
- `Review`: Ratings & comments with admin approval flags
- `BlogPost`: Educational bird care guides
- `SiteSetting`: Key-value dynamic storefront configuration

---

## 🚀 Production Deployment (Vercel & PostgreSQL)

To deploy to production on Vercel with managed PostgreSQL (Supabase / Neon):

1. Change `provider = "postgresql"` in `prisma/schema.prisma`.
2. Set your production `DATABASE_URL` in Vercel environment variables.
3. Deploy directly via Vercel CLI:
   ```bash
   vercel
   ```
