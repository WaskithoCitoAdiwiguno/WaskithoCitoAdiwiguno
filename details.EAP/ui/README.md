# ui/

GitHub Pages frontend for the Employee Attrition Prediction demo.

## What it does

- Employee input form mirroring the notebook/Gradio inputs
- `Mulai pelatihan` button that calls `POST /train`
- Prediction + SHAP waterfall-style bars rendered in the browser
- HR narrative from Groq, requested server-side
- Bring-your-own-key: the user enters their own Groq API key (no bundled key);
  the key is sent to the backend and stored server-side

## Config

Open `ui/app.js` and set:

```js
const BACKEND_BASE = "https://YOUR-SPACE-USERNAME-HERE.hf.space";
```

Replace the placeholder with the public URL of the backend Space.

## Publish

- Put the contents of `ui/` on GitHub Pages, or
- Serve locally for testing with any static server, for example:
  - `python -m http.server 8080 -d ui`
  - or the VS Code Live Server extension pointing at `ui/`

## Notes

- No API key is bundled. Users bring their own Groq key (free at
  console.groq.com); it is sent to the backend and never stored in the page.
- If the backend is not ready, the UI asks the user to start training first.
- Without a key, prediction + SHAP still work; the HR narrative section shows
  a hint to enter a key.
- SHAP is rendered client-side from the backend’s SHAP values.
