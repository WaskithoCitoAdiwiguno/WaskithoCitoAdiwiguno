# details.EAP

Employee Attrition Prediction demo project.

Split:
- `backend/` — HF Space Python backend (FastAPI)
- `ui/` — GitHub Pages frontend

## Quick start

1. Train the backend:
   - curl/postman or the UI “Mulai pelatihan” button to `POST /train`
2. Open the UI and set the backend URL in `ui/app.js`.
3. Enter your own Groq API key in the UI (free at console.groq.com).
4. Run a prediction and review SHAP + narrative.

## Backend local run

Place `employee_attrition_clean.csv` in `backend/data/` and start:

```bash
python -m uvicorn backend.app:app --host 0.0.0.0 --port 7860
```

Or use the Space runner:

```bash
python backend/run_space.py
```

## Groq key (BYOK)

No API key is bundled with this project. Users enter their own Groq key in the
UI (stored server-side in `backend/.env.local`, git-ignored), or the deployer
can set `GROQ_API_KEY` as an environment variable / Space secret as a
server-side fallback. Without a key, prediction + SHAP still work; only the
HR narrative is unavailable.
