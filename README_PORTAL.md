# Web Discovery Portal

A high-performance web discovery portal built with Next.js, React, and Tailwind CSS. Ultra-fast, typography-focused design for student builders and campus ecosystems.

## Features

- **Minimal Hero Section**: Clean, distraction-free landing page with bold typography
- **Responsive Design**: Mobile-first approach with breakpoints for all screen sizes
- **Dark Mode Support**: Seamless light/dark theme switching
- **High Performance**: Built on Next.js 16 with Turbopack for blazing-fast development
- **Typography-Focused**: Large, readable fonts and optimized spacing

## Quick Start

### Prerequisites
- Node.js 18+ (recommended: 20 LTS)
- npm or yarn

### Installation

```bash
cd portal
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The site auto-reloads on file changes.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
portal/
├── app/
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Hero section homepage
├── public/             # Static assets
├── postcss.config.mjs  # PostCSS/Tailwind configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies
```

## Customization

### Update Headline
Edit the `<h1>` text in `app/page.tsx`.

### Change Button Links
Replace the `href="#"` attributes in the button `<a>` tags with your actual URLs.

### Styling
Modify Tailwind classes directly in components. Key classes used:
- `text-4xl sm:text-5xl md:text-6xl` – Responsive headline
- `bg-black dark:bg-white` – Theme colors
- `transition-all hover:` – Smooth interactions

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Other Platforms
The app is compatible with Netlify, GitHub Pages, and any Node.js host. See [Next.js deployment docs](https://nextjs.org/docs/deployment).

## Tech Stack

- **Framework**: Next.js 16.2.9
- **UI Library**: React 19.2.4
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5
- **Linting**: ESLint 9

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
