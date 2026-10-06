# Shazy b designs — website

Static site (plain HTML / CSS / JS, no build step, no dependencies). Fonts are self-hosted.

```
index.html        all content + inline SVG illustrations
css/main.css      design system + layout
css/fonts.css     Caprasimo, Poppins, Caveat (self-hosted woff2)
js/main.js        interactions (edit CONFIG + GIFT at the top)
assets/img/       photos (from Sharon's Facebook page + her flyers)
```

Preview: `python3 -m http.server 4391` in this folder, then open http://localhost:4391

## The 60th birthday surprise
Send Mum **`<site-url>/?gift`** (or `#gift`). She gets a wrapped present, confetti and a message,
then the normal site with a little gold "60" button to re-read it. The public site (no `?gift`) shows none of this.
Edit the wording in `GIFT` at the top of `js/main.js`.

## Open items
- **Email address** — not known. Set `CONFIG.email` in `js/main.js` to show email buttons in the contact section.
- **Location / area** — flyers only say "local". Add a town name to the hero + contact copy (and `LocalBusiness` JSON-LD in `index.html`).
- **Review quote** — Cindy T.'s Facebook review is used (first name + initial only, spelling tidied). Ask permission / swap if preferred.
- **Photos** — taken from her Facebook page (up to ~950px wide) and flyers. Fine for web; send originals for sharper, bigger images.
- **Cap + alteration photos** — only the three flyer cap photos exist; more cap photos would lift that section.
- **Contact** — the form copies the message and opens Messenger / Instagram DM (no backend needed).
  A real form backend (Formspree / Resend) is an easy upgrade.
- **Deploy** — drag the folder onto Cloudflare Pages / Netlify, or any static host. Point the domain, then update `og:image` + `sameAs` URLs.

## Sections / interactions
Tape-measure scroll bar · thread-and-needle hero · draggable bag gallery + lightbox · **Design-a-bag** studio
(denim, patch, strap, hardware, charm → "Ask Sharon for one like this" pre-fills the contact note) ·
**Cap studio** (flat / baker boy, fabric, lining, flip to peek inside) · hem slider, draggable zip, mend-the-tear demos ·
reviews · contact note.
Respects `prefers-reduced-motion`; keyboard operable (radio groups, zip via ↑/↓, range slider).
