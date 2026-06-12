# @jsonforms/demo-all

Combined static demo app: aggregates every renderer-set demo application into a
single deployable folder with a landing page for selecting the renderer set.

```bash
pnpm install && pnpm build                   # from the repo root, once
pnpm --filter @jsonforms/demo-all build      # build the combined app
pnpm --filter @jsonforms/demo-all preview    # serve dist/ locally
```

The build runs each demo app's Vite build with `--base=/<id>/` directly into
`dist/<id>/` and places the landing page at the dist root:

```
dist/
├── index.html          ← landing page (renderer-set selection)
├── react-material/     ← @jsonforms/demo-react-material
└── react-vanilla/      ← @jsonforms/demo-react-vanilla
```

All demo apps render the same shared examples from `@jsonforms/examples`, so renderer
sets can be compared side by side. Future renderer sets (Vue, Angular, …) are added as
further sub-apps in `build.js` plus a card on the landing page — the aggregation is
framework-agnostic by design.
