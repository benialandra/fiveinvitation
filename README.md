# FiveInvitation - Digital Wedding Invitation Platform

FiveInvitation is a full-stack web application designed for creating, customizing, and sharing beautiful digital wedding invitations. It features a theme marketplace, a seamless ordering process with payment gateway integration, and a user-friendly editor for personalizing every detail of the invitation.

## ✨ Features

- **🖼️ Theme Marketplace**: Browse and select from a variety of professionally designed invitation themes.
- **💳 Seamless Ordering**: A simple and secure checkout process to purchase and initiate an invitation.
- **💸 Payment Integration**: Integrated with Midtrans for handling online payments.
- **✍️ Invitation Customization**: After purchase, users can easily edit couple's names, parents' names, event dates, locations, maps, personal stories, and background music.
- **📸 Photo Uploads**: Personalize the invitation with custom cover and hero images.
- **🔗 Custom URL Slugs**: Create a unique and memorable link for each invitation (e.g., `domain.com/your-name`).
- **📖 Digital Guest Book**: Guests can leave their wishes and messages directly on the invitation page in real-time.
- **✅ RSVP Management**: Guests can confirm their attendance, and the couple can track the responses.
- **🔒 Order Tracking**: Users can check the status of their order using a unique code.
- **⚙️ Admin Panel**: A dedicated interface for administrators to manage themes, including adding and editing theme details.
- **📧 Email Notifications**: Automated email notifications for successful payments and payment reminders for pending orders.

## 🚀 Tech Stack

- **Frontend**:
  - **Framework**: React (with Vite)
  - **Language**: TypeScript
  - **Styling**: Tailwind CSS
  - **Routing**: React Router
  - **UI/Animation**: Framer Motion, Lucide Icons

- **Backend**:
  - **Runtime**: Node.js with Express
  - **Database**: Supabase (PostgreSQL)
  - **Payment Gateway**: Midtrans
  - **File Uploads**: Multer
  - **Scheduled Jobs**: node-cron
  - **Email**: Nodemailer

- **Deployment**:
  - Ready for deployment on platforms like Render, Railway, or Vercel.

## 🏁 Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A Supabase account
- A Midtrans account (Sandbox)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/fiveinvitation.git
cd fiveinvitation
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of the project by copying the example file:

```bash
cp .env.example .env
```

Now, fill in the required environment variables in the `.env` file. Refer to `DEPLOYMENT.md` for detailed instructions on where to find these keys.

```env
# Supabase Configuration
VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"

# Midtrans Configuration
VITE_MIDTRANS_CLIENT_KEY="YOUR_MIDTRANS_CLIENT_KEY"
MIDTRANS_SERVER_KEY="YOUR_MIDTRANS_SERVER_KEY"
MIDTRANS_IS_PRODUCTION=false

# Optional: SMTP for Email Notifications
SMTP_HOST="YOUR_SMTP_HOST"
SMTP_PORT=587
SMTP_USER="YOUR_SMTP_USER"
SMTP_PASS="YOUR_SMTP_PASSWORD"
SMTP_SECURE=false
```

### 4. Set Up the Database

1.  Log in to your Supabase account and create a new project.
2.  Navigate to the **SQL Editor**.
3.  Copy the entire content of the `supabase_schema.sql` file from the project root.
4.  Paste the SQL into the editor and run it to create the necessary tables (`orders`, `themes`, `guest_books`, `rsvp`) and security policies.
5.  **Enable Realtime**: Go to `Database` -> `Replication` and enable realtime for the `guest_books` table.

### 5. Run the Development Server

Once the installation and configuration are complete, you can start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 📦 Available Scripts

- `npm run dev`: Starts the development server with Vite and the Express backend.
- `npm run build`: Compiles the frontend and backend for production.
- `npm run start`: Runs the production-ready server from the `dist` folder.
- `npm run lint`: Lints the project using the TypeScript compiler.

## 🚢 Deployment

For detailed deployment instructions, including setting up webhooks and environment variables on a live server, please refer to the [**DEPLOYMENT.md**](./DEPLOYMENT.md) file.
