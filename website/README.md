# SSMI Website

This folder is the public-facing Vite + React site for the church.

## What it contains

- `src/app/churchBlueprint.js`: a thin re-export of the shared church blueprint from `functions`.
- `src/routes/siteRoutes.js`: the route registry used by React Router.
- `src/components/layout`: shared header and footer shells.
- `src/components/ui`: reusable route cards.
- `src/pages`: the home screen, generic route page, and 404 page.

## FlutterFlow mapping

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

## Validation

- `npm run build` passes for the current scaffold.
- Routes are generated from the shared blueprint rather than hand-maintained one by one.
