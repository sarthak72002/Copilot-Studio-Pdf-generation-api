# Compass AI Trust Document API

Mock backend API for generating trust document PDFs. Used as a REST API tool in Copilot Studio.

## Deploy to Render

1. Push this repo to GitHub
2. Go to https://render.com
3. Create a **New Web Service**
4. Connect your GitHub repo
5. Settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

## Endpoints

- `POST /documents/trust` — Generate trust document PDF
- `GET /documents/:id/download` — Download PDF (locked)
- `GET /pay/:id` — Payment info
- `GET /` — Health check
