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

- An original titanium sculpture hero, generated with the built-in image generation tool, plus real screenshots of FreeLLM Hub, Omsetra and VedaaChari.
- Product-page storytelling inspired by the visual hierarchy, large imagery, project highlights and section rhythm of Apple's iPhone product page. No Apple assets or code are included.
- Responsive desktop and mobile layouts; native anchor navigation and keyboard focus states.
- Scroll-linked hero movement, a native horizontal highlights gallery, direct gallery selection, keyboard controls, and expandable project details.
- Cinematic scroll motion: gentle hero rotation, product screens that settle from a subtle perspective tilt, one-time heading entrances, section edge blends, a reading-progress line, and contextual chapter names. Mobile uses smaller travel and tilt, native touch scrolling and gallery snap stops. Visible sections alone are measured in a single animation frame per scroll update; there is no continuous rendering loop or scroll interception.
- Reduced-motion preferences disable hero movement; the manual motion control supports other visitors. Scrolling works without animation and content remains visible without JavaScript.
- No analytics, forms, API keys, client-side dependencies, or backend service. Google Fonts is optional; system fallbacks remain available.

## Ponytail

The requested [Ponytail](https://github.com/DietrichGebert/ponytail) is a coding skill, not a backend framework. Its [SKILL.md](https://github.com/DietrichGebert/ponytail/blob/main/skills/ponytail/SKILL.md) informed the implementation: native browser features and minimal dependencies. No Ponytail runtime or hooks are installed. GitHub Pages serves the site statically.

## Verification

Run `node --check cinema.js`, `node test_cinema.cjs`, and `python check_homepage.py`. The tests cover gallery boundaries, direct selection, keyboard control, motion pause/resume, reduced-motion defaults, five project entries, two teasers, anchor destinations and local stylesheet/script files.

Run `node --check scroll-motion.js` and `node test_scroll.cjs` for the added motion layer. Its tests cover viewport-based product motion, chapter names, entrance cancellation, reduced-motion defaults and gentler mobile motion. The Pause motion control also cancels in-flight heading entrances and restores static product visuals.

Browser QA covers desktop, 768px tablet and 375px mobile layouts, gallery boundaries, project detail expansion, touch-target sizes, page overflow, and console errors. Product screenshot text is illustrative of the captured product version, rather than a promise that every advertised service was tested.

## Resources used

- [gstack](https://github.com/garrytan/gstack): design-review guidance for hierarchy, typography, interaction states, responsive design and evidence. The local gstack runner could not start under this Windows session; no automated gstack score is claimed.
- [REA](https://github.com/morluto/rea): a controlled Chromium browser run against the local homepage with a 375×812 viewport and reduced motion. Navigation completed with no captured page errors. This is a load smoke check; interaction checks were run separately.
- [free-for-dev](https://github.com/ripienaar/free-for-dev): resource discovery, retaining static hosting and Google Fonts without adding account-based services or paid dependencies.

## Assets

`titanium-knot.webp` is the original generated hero. The three `*-screen.webp` files are screenshots of the public project pages. All four images are optimized WebP files. Source PNGs are retained in the local project folder and are not needed for deployment.



## Founding pilots and support

The portfolio links to five free pilots and optional personal-service offers at https://om-panchal-pilots.hp909145.chatgpt.site/. Commercial offer details and the email-request flow are hosted there. The join flow opens a draft to podcastomi@gmail.com; visitors send it from their own email app. No signup, request database or payment verification is claimed. Every homepage HTML page links to Buy Me a Coffee and the existing UPI QR. `support.html` now uses the portfolio design system and preserves the original QR image and UPI payee details.

Free-pilot access does not require a contribution. Paid work is agreed by email before payment, including scope, total price, timing and cancellation terms. Live payment processing is external; no payment was performed in testing. New page/offer route validation and existing motion regressions pass; fresh browser visual checks are unavailable in this session.
