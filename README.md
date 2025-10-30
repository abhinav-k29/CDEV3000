
  # Learning Management System

  This is a code bundle for Learning Management System. The original project is available at https://www.figma.com/design/k9m3fdIgjJUimiu9eE0Tl5/Learning-Management-System.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  
## How to Run Locally
1. Install Node.js (LTS) from https://nodejs.org
2. Install deps: `npm i`
3. Start dev server: `npm run dev`  → open http://localhost:3000
4. Build: `npm run build`
5. Preview production build: `npm run preview` → http://localhost:3000

## Deploying / Pushing to GitHub
```bash
git init
git branch -M main
git add .
git commit -m "Initial commit: Intellecta LMS MVP"
# Create a new repo on GitHub (empty), then:
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## CI (optional)
You can add a GitHub Actions workflow under `.github/workflows/ci.yml` to build on push.
