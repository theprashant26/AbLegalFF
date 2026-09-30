# Ab Initio Legal — Website, Option B ("Law Business" style)

Static front-end for design approval: HTML, CSS, JavaScript, Bootstrap 5, GSAP + ScrollTrigger (native scrolling).
Layout and typography follow the LawBusiness theme (Playfair Display + Verdana, black & white photography, flat
buttons); the accent colour is the gold of the Ab Initio logo. Built from scratch — no theme files are used.
Open `index.html` in a browser to preview. Option A lives in the `AbLeagF` folder.

## Pages
| File | Theme equivalent |
|---|---|
| `index.html` | Home — hero slider (Supreme Court → Delhi High Court), 4 principles, mission, practice areas, year in review, team carousel, publications, clients |
| `about.html` | About Us |
| `culture.html`, `clients.html` | About-style pages |
| `practice-areas.html` | Services / Our Expertise |
| `practice.html?area=<slug>` | Single service page (one template for all 20 areas) |
| `team.html` | Our Attorneys |
| `profile.html?member=<slug>` | Attorney profile (one template for every team member) |
| `publications.html` | Blog page (filters: newsletters, articles, research, updates) |
| `post.html?id=<slug>` | Single post |
| `careers.html`, `contact.html`, `disclaimer.html`, `privacy-policy.html` | — |

Header, footer, search, mobile menu, disclaimer pop-up and WhatsApp button are rendered by `assets/js/layout.js`.

## Content
- `assets/data/site-data.js` — firm details, team (LinkedIn URLs), practice areas (text, key matters, photo), clients, testimonials, job openings.
- `assets/data/publications.js` — newsletters & publications. Entries marked `sample: true` are placeholders for design review.

### Adding a newsletter (until the CMS is built)
1. Copy the PDF into `publications/newsletters/`.
2. Add an entry at the top of `assets/data/publications.js`:
   ```js
   { type: "newsletter", image: "assets/img/stock/books-coffee.jpg",
     title: "Ab Initio Legal Newsletter — October 2025", date: "2025-10-15",
     summary: "One or two lines.", tags: ["Supreme Court"],
     file: "publications/newsletters/2025-10-newsletter.pdf" },
   ```
The page sorts by date (latest first) and creates the detail page automatically.

## Notes for the backend developer
- Forms (contact, practice enquiry, appointment on profiles, careers with CV upload, newsletter) validate on the front-end and show success states. Each form has `data-endpoint`; wire the POST in `initForms()` in `assets/js/main.js` (search `BACKEND HOOK`).
- Data files can be replaced by API responses with the same shape.

## Image credits
- Supreme Court of India — Wikimedia Commons, CC BY-SA 4.0. High Court of Delhi — official photo gallery.
- Other photographs — public domain (CC0) from StockSnap and Wikimedia Commons (gavel: Joe Gratz / Minneapolis City Council; handcuffs; law libraries).
- Team photos and client logos — from the firm's litigation profile.
