# Om Panchal / Omi811

The personal homepage of Om Panchal, built for [omi811.github.io](https://omi811.github.io/).

Five selected projects: FreeLLM Hub, Omsetra, VedaaChari, REA Developer Ecosystem, and Universal SEO Agent Suite. Architecture and stock trading are presented as upcoming projects without release dates or invented capabilities.

## Run locally

Use Python's static server from this folder:

```sh
python -m http.server 4174 --bind 127.0.0.1
```

Open http://127.0.0.1:4174. No installation or build is required.

## GitHub Pages

Publish this directory's contents at the root of `Omi811/Omi811.github.io`. Keep the existing `upi-qr.png`. In Settings → Pages, use **Deploy from a branch**, **main**, **/ (root)**.

`support.html` preserves the previous support homepage. The UPI QR image remains at its existing repository path. The homepage links to that page, the GitHub account, and the original project destinations.

## Design and behavior

- Original orbital canvas artwork; all project visuals are illustrative HTML/CSS compositions.
- Responsive desktop and mobile layouts; native anchor navigation and keyboard focus states.
- Motion pauses off screen and in background tabs, starts paused when reduced motion is preferred, and can be paused manually.
- No analytics, forms, API keys, client-side dependencies, or backend service. Google Fonts is optional; system fallbacks remain available.

## Ponytail

The requested [Ponytail](https://github.com/DietrichGebert/ponytail) is a coding skill, not a backend framework. Its [SKILL.md](https://github.com/DietrichGebert/ponytail/blob/main/skills/ponytail/SKILL.md) informed the implementation: native browser features and minimal dependencies. No Ponytail runtime or hooks are installed. GitHub Pages serves the site statically.

## Verification

Run `node --check app.js` and `python ../../work/check_homepage.py`. Browser QA covers the desktop layout, 390px mobile layout, five project entries, two teasers, anchor destinations, motion pause and resume, and the browser console.
