# SSMI Website

This folder is now the public-facing Vite + React site for the church.

## What this folder contains

- `src/app/churchBlueprint.js`: the shared content map derived from `flutter-website/lib/index.dart`.
- `src/components/layout`: header and footer shells for the public site.
- `src/components/ui`: reusable cards and presentation helpers.
- `src/pages/HomePage.jsx`: the first React landing page and route-structure overview.

## How the Flutter app maps over

- **Public pages**: Home, About Us, Locations, Watch, Care, Give, Contact Us, Privacy Policy.
- **Ministry pages**: Prayer, Counseling, Ministries, Partner, Be a Partner, Baptism, Fellowship, Follow Jesus, Youth, Welfare, Couples, For Men, For Women, Young Adults, Singles, School of Ministry, Super Kids.
- **Branch pages**: Boksburg, E Malahleni, Hlutsi, Lagos, Ludzeludze, Mbabane, Online, Orange Farm, Siteki.
- **Events and campaigns**: Events, Register, Camp Yolo, Fire Conference, Superman Conference, Branch Template, Youth Template, Socials.
- **Resources and giving**: E Resources Center, Podcasts, Branch Give, Beyond Tithe.

## Run locally

```bash
cd website
npm install
npm run dev
```

## Next steps

1. Add `react-router-dom` and turn the blueprint into real routes.
2. Move page-specific content into JSON or CMS-backed modules.
3. Rebuild the top public pages one by one using the shared `siteGroups` data.
