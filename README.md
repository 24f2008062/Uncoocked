# Uncooked Portal 🚀

Welcome to **Uncooked Portal**, the premier campus event management and discovery platform. Built with a modern Next.js stack, this platform allows organizers to host, manage, and analyze campus events while providing attendees with a seamless experience to discover events, register, and download digital tickets.

---

## ✨ Features

### For Attendees
- **Event Discovery**: Explore upcoming events on campus (Hackathons, Fests, Workshops, Meetups).
- **Seamless Registration**: Reserve free tickets or purchase paid tickets with ease.
- **Digital Tickets**: Download beautifully formatted, high-resolution PNG tickets complete with QR codes for easy check-in.
- **Real-Time Bulletins**: Stay updated with live announcements and schedule changes from event organizers.
- **Waitlisting**: Automatically join waitlists for events that have reached maximum capacity.

### For Organizers
- **Event Dashboard**: A comprehensive command center to manage all aspects of your hosted events.
- **Analytics & Insights**: Track revenue, registrations, and page views via interactive charts (powered by Recharts).
- **Attendee Management**: View who is attending, manage waitlists, and track check-ins.
- **Live Announcements**: Broadcast real-time updates and pinned messages directly to the public event details page.
- **Image Cropper**: Built-in interactive image cropping tool for uploading perfect event banners.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [SQLite](https://sqlite.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Charting**: [Recharts](https://recharts.org/)
- **Image Generation**: `html-to-image` (for generating PNG tickets)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Install Dependencies
Clone the repository and install the required NPM packages:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root of your project. You will need to add your API keys for the email contact form:
```env
RESEND_API_KEY=your_resend_api_key_here
```

### 3. Setup the Database
Push the Prisma schema to create the local SQLite database (`dev.db`), and optionally seed it with sample data:
```bash
npx prisma db push
npx prisma db seed
```

### 4. Start the Development Server
Run the local Next.js development server:
```bash
npm run dev
```

The portal will be available at [http://localhost:3000](http://localhost:3000).

### 5. Database Management (Optional)
To easily view and edit your database records visually, you can launch Prisma Studio in a separate terminal:
```bash
npx prisma studio
```
This will open up at `http://localhost:5555`.

---

## ⚠️ Important Notes
- **Currency**: The platform is natively configured to operate using **Indian Rupees (₹)**.
- **Location Constraints**: The current MVP is locked to operate exclusively in **Lucknow**. 
- **Database Concurrency**: Because the project relies on SQLite (`dev.db`), be careful when running multiple heavy writes simultaneously (e.g., do not run `prisma db push` while `prisma studio` and `next dev` are heavily interacting with the database, or you may hit a lock conflict).

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
