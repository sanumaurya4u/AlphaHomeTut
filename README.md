# Alpha Home Tuition — Website

A modern, professional, responsive website for **Alpha Home Tuition** — a home tuition mediator company connecting students with verified tutors.

## Tech Stack

- **React 19** + **Vite 8**
- **Tailwind CSS v4**
- **Framer Motion** — scroll & entrance animations
- **Lucide React** — icon library
- **React Hot Toast** — toast notifications

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

## Deploy to Vercel

### Option 1 — Vercel CLI

```bash
npm i -g vercel
vercel
```

### Option 2 — GitHub Integration

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import the GitHub repository
4. Vercel auto-detects Vite — click **Deploy**

> No additional configuration needed. Vercel handles Vite projects out of the box.

## Project Structure

```
src/
├── assets/          # Hero banner image
├── components/      # 14 React components
├── data/            # Static data (services, testimonials, FAQs, stats)
├── App.jsx          # Main app shell
├── main.jsx         # Entry point
└── index.css        # Tailwind + custom styles
```

## Features

- Sticky responsive navbar with mobile hamburger menu
- Hero banner with animated stats and CTAs
- About section with mission/vision cards
- Services with glassmorphism cards
- How It Works timeline
- Find Tutor & Become Tutor forms with toast notifications
- Animated statistics counter
- Testimonials carousel with star ratings
- Accordion FAQ section
- Contact section with form and Google Maps
- Professional multi-column footer
- Floating WhatsApp button
- Scroll-to-top button
- Smooth scroll & reveal animations throughout

## Contact

- **Phone:** 7295948480
- **Email:** alpha.hometuition4u@gmail.com

---

© 2025 Alpha Home Tuition. All Rights Reserved.
