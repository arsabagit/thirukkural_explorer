# Thirukkural Explorer

A modern, fully offline web application to explore, search, and export all 1330 Thirukkurals. Built with React, Vite, and Tailwind CSS.

## Features
- **100% Offline**: All 1330 Kurals and their meanings are bundled locally. No internet connection is required to search or view data.
- **Advanced Search**: Filter by Kural Number, Chapter Number, Chapter Name, or search for specific words in Tamil or English.
- **Excel Export**: Download your filtered results directly to an `.xlsx` file with perfectly formatted columns and line breaks.
- **Responsive UI**: Clean, readable interface optimized for both desktop and mobile viewing.

## Prerequisites
To run this project locally, you need to have **Node.js** installed on your computer. You can download it from [nodejs.org](https://nodejs.org/).

## How to Run Locally

Since this is a modern React application, it cannot be run by simply double-clicking an `index.html` file. You need to start a local development server.

1. **Open your terminal** (Command Prompt, PowerShell, or Terminal).
2. **Navigate to the project folder**:
   ```bash
   cd path/to/thirukkural-explorer
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```
5. **Open your browser** and go to the URL provided in the terminal (usually `http://localhost:5173` or `http://localhost:3000`).

## How to Build for Production

If you want to build the static files for deployment:

```bash
npm run build
```
This will generate a `dist` folder containing the optimized HTML, CSS, and JavaScript files.

## Hosting on GitHub Pages / Vercel / Netlify
This project is a static Single Page Application (SPA), making it incredibly easy to host for free.
- **GitHub**: You can push this code to a GitHub repository.
- **Deployment**: You can connect your GitHub repository to platforms like **Vercel**, **Netlify**, or **GitHub Pages**. They will automatically run `npm run build` and host your `dist` folder for free!

## Tech Stack
- React 18
- Vite
- Tailwind CSS
- Lucide React (Icons)
- SheetJS (XLSX Export)
