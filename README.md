# Services Page – Puzzle Task

A mobile-first **Services** management UI built with React, Vite, and Tailwind CSS. Icons use the official Hugeicons React packages (`@hugeicons/react` + `@hugeicons/core-free-icons`), which replace the deprecated `hugeicons-react` package.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview   # optional: preview production build
```

## Deploy (Vercel)

The project includes a `vercel.json` for SPA routing and asset caching. Connect the repo to [Vercel](https://vercel.com); the default build command and `dist` output are already set.

## Stack

- **React 19** + **TypeScript**
- **Vite 7**
- **Tailwind CSS 4** (via `@tailwindcss/vite`)
- **@hugeicons/react** and **@hugeicons/core-free-icons** for icons

## What’s included

- Top bar: avatar, message and menu icon buttons
- **Services** section: title, “New Service” (primary pink), “Copy Link”, “New Cate”, and more-options (vertical ellipsis)
- **Technology** category card: collapsible, with edit/delete/expand icons and a sample “Fashion Design” service (price, description, “public” tag, edit/copy/refresh/delete, “Logo Design £0” tag, “Intake Form” button)
- **Add-ons** section: heading, short description, and “New Add-on” button

Collapse/expand the Technology card with the arrow icon in the card header.
