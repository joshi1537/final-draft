<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1fd-6BhZNjzmv13Rj6iU6XUgH3_fOsbMv

## Run Locally

**Prerequisites:**  Node.js


# Project — How to run

1. Install dependencies
   - npm: npm install
   - yarn: yarn
   - pnpm: pnpm install

2. Set your API key
   - Create a .env file at the project root or export env vars in your shell.
   - This app reads:
     - process.env.API_KEY (common)
     - Vite users: VITE_API_KEY (read via import.meta.env.VITE_API_KEY)
   - Example `.env`:
     API_KEY=your_api_key_here
     # or for Vite:
     VITE_API_KEY=your_api_key_here

3. Run the dev server
   - Vite: npm run dev (or yarn dev / pnpm dev)
   - Create React App: npm start (or yarn start / pnpm start)

4. Build and preview
   - Build: npm run build
   - Preview (Vite): npm run preview
   - For CRA, serve build with a static server (e.g., serve -s build)

5. Troubleshooting
   - If nothing starts, check package.json scripts to see the exact commands.
   - Ensure your env var is available at build time (some bundlers require prefixes).
   - Look at the browser console and terminal logs for runtime errors.

That's it — install, set API key, and run the dev script your project uses.
