# ELVERA — Premium Men's Fashion

> A modern, responsive e-commerce storefront for premium men's fashion, built with React + TypeScript and deployed on Vercel.

🌐 **Live Demo:** [elvera-navy.vercel.app](https://elvera-navy.vercel.app)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## Overview

Elvera is a premium men's fashion web application offering a clean, elegant shopping experience. The project focuses on modern UI/UX design, performant builds, and seamless deployment.

Key highlights:
- Fully typed with **TypeScript** (99%+ of codebase)
- Fast development and production builds powered by **Vite**
- Deployed and hosted on **Vercel** with custom routing via `vercel.json`

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React | UI component library |
| TypeScript | Type-safe JavaScript |
| Vite | Build tool & dev server |
| Vercel | Hosting & deployment |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/dharanigovardhan2008/Elvera.git
cd Elvera

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` by default.

---

## Project Structure

```
Elvera/
├── src/                  # Application source code
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page-level components
│   └── main.tsx          # App entry point
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite build configuration
└── vercel.json           # Vercel deployment settings
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

---

## Deployment

This project is deployed on [Vercel](https://vercel.com). The `vercel.json` file handles client-side routing so that all routes resolve correctly on page refresh.

To deploy your own copy:

1. Fork this repository
2. Import it into your Vercel dashboard
3. Vercel will auto-detect the Vite framework and configure the build

---

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

Made with ❤️ by [dharanigovardhan2008](https://github.com/dharanigovardhan2008)
