# WisdomAsia 2026 redesign — review branch

Implemented on `redesign-2026` from main commit `053b71ea722ec0c44eb0898afb185a1312bda19e`.

## Changes

- Original corporate logo and WIN artwork retained without modification.
- Visual direction extends the corporate palette and photographic character using newly AI-generated photorealistic scenes. All deck-derived photographs and artwork have been removed from the final site. Only the original company and WIN logos are retained.
- Transcultural Intelligence is the principal hero heading and the title of a dedicated philosophy section, linked from the main navigation. The copy explains how cultural context turns research evidence into useful interpretation.
- Sections: introduction, about, expertise, philosophy, approach, founder, network and contact.
- Commercial research positioning with a secondary, text-only founder profile. Barry’s three decades of research experience, China and regional background, prior company roles, PhD and psychology teaching provide specific grounds for credibility; no portrait or university appointment is featured.
- Qualitative and quantitative methods grounded in the May 2026 corporate presentation; proprietary product names omitted pending confirmation of availability.
- Original Shanghai address retained following owner confirmation: Room 703, Golden Magnolia Plaza, No. 1 Dapu Road, Huangpu District, Shanghai 200023, P.R. China.
- Corporate enquiry email preserved; WIN affiliation checked against its official members directory. Independent network companies are explicitly distinguished from WisdomAsia.
- Native section anchors, keyboard focus indicators, skip link, responsive navigation, Escape-to-close menu and reduced-motion support.
- External font and icon CDN dependencies removed. No new application framework.
- Canonical URL, robots.txt and sitemap retained; social metadata now uses an absolute image URL. Structured data matches the commercial positioning.
- Dependency lockfile added for reproducibility.

## Publication safeguard

The existing workflow triggers automatically only on `main`. This branch additionally guards the build job with `github.ref == 'refs/heads/main'`, preventing manual dispatch of this workflow from the redesign branch from reaching deployment. No Pages settings, domain settings or production files have been changed remotely. Do not merge or deploy until the owner approves.

## Validation

- `npm run build` passed.
- `node --check script.js` passed.
- `git diff --check` passed.
- Static checks passed: unique IDs, one H1, valid JSON-LD, all fragment links resolve, all image paths exist; logo, favicon, WIN artwork, robots and sitemap are byte-identical to originals.
- Browser access to the live website, GitHub UI and local preview was denied by host-access policy. Visual QA, interactive navigation and responsive layout behaviour remain unverified in a browser.
- The live website was examined through its source and publicly indexed content; a live visual comparison was not possible.

## Review locally

Run `npm ci`, then `npm run dev`, and open the local address printed by Vite. Check desktop, tablet and narrow mobile widths; keyboard navigation, mobile menu, all section links, email and external links.

An accompanying standalone HTML preview embeds the built CSS, JavaScript and existing logos, allowing review without installing dependencies. It is a review copy and is not a production deployment.

## Source references

- https://wisdomasia-mr.com/
- https://winmr.com/members/ (checked 1 November 2026; office directory details appear older than the owner's confirmed address, so they were not copied)
- WisdomAsia - Transcultural Intelligence Updated May 2026.pdf


## Rebuild the downloadable preview

Run `npm run build`, then `python3 scripts/build-review-preview.py`. This embeds the built assets into a standalone HTML review copy without deployment.
