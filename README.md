# Sizu Portfolio

A premium, modern portfolio website built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS v4**. It features a clean, unified design architecture prioritizing content readability, interactive 3D elements, smooth page transitions, and effortless customization.

## ✨ Key Features

- **Unified Modern Aesthetic**: A singular, refined dark/light mode layout that balances stark minimalism with rich interactive elements.
- **Interactive 3D Elements**: Engaging hero section featuring cursor-reactive 3D geometry and a subtle `StarfallCanvas` particle background powered by Three.js and React Three Fiber.
- **Custom Hardware-Accelerated Cursor**: A specialized `CustomCursor` component that provides an elevated, smooth interactive experience across the site.
- **Dynamic Navigation**: Intuitive scroll-spy navigation within the `Navbar` that automatically highlights active links as you scroll through sections.
- **Robust Theme Toggle**: Type-safe, responsive light/dark mode switching seamlessly integrated with Tailwind CSS v4.
- **Markdown Rendering**: Full support for rich text and syntax-highlighted code blocks in blog posts via `react-markdown` and `react-syntax-highlighter`.
- **Blog Integration**: Includes a built-in `PostPage` markdown renderer for sharing technical articles and thoughts.

## 🛠 Tech Stack

- **React 18** — Functional components with hooks
- **React Router v7** — Client-side routing for the homepage and blog posts
- **Vite 6** — Lightning-fast HMR and build tooling
- **TypeScript** — End-to-end type safety
- **Tailwind CSS v4** — Utility-first styling via the `@tailwindcss/vite` plugin
- **Motion (Framer Motion)** — Smooth layout transitions and micro-animations
- **Three.js & React Three Fiber** — Performant 3D graphics and interactions
- **Lucide React** — Crisp, consistent iconography

## 📁 Project Structure

```
portfolio-example/
├── public/
│   └── images/              # Project screenshots & assets
├── src/
│   ├── components/          # UI Components
│   │   ├── layout/          # Navbar, Footer
│   │   ├── sections/        # Hero, About, Work, Projects, etc.
│   │   └── ui/              # Buttons, CustomCursor, StarfallCanvas, 3D Scenes
│   ├── data/                # Centralized portfolio data (portfolio.ts)
│   ├── lib/                 # Utility functions and data fetchers (e.g., posts.ts)
│   ├── pages/               # Route components (PostPage.tsx)
│   ├── types/               # TypeScript type definitions
│   ├── App.tsx              # Root app with routing and global providers
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles & Tailwind directives
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** (or any package manager of your choice)

### Install & Run

```bash
# Clone the repository
git clone <repository-url>
cd portfolio-example

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview   # Preview the production build locally
```

## 🎨 Personalizing

All main portfolio content lives in a single, well-typed file:

```
src/data/portfolio.ts
```

Edit the `portfolio` object to replace the sample data with your own:

- **Name, title & tagline**
- **About paragraphs**
- **Skills list**
- **Experience entries** (role, company, period, impact, tech)
- **Education**
- **Projects** (title, description, tech, image, highlights)
- **Social links**

Adding blog posts can be managed through the logic in `src/lib/posts.ts` and rendered automatically on the site.

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the Vite development server with HMR |
| `npm run build` | Type-check with `tsc` and build for production |
| `npm run preview` | Preview the production build locally |

## 📄 License

This project is private. See `package.json` for details.
