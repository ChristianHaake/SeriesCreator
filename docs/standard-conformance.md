# haak3 Standard Conformance

Standard:
https://github.com/ChristianHaake/haak3-webapp-standard

Standard version: `1.0.0-draft`

Last reviewed: `2026-11-09`

## Exceptions

None.

### Resolved

```text
Rule: Production CSP should avoid inline styles.
Resolution: style-src no longer includes 'unsafe-inline'. React applies its
inline style props through the CSSOM (element.style.*), which CSP style-src
does not govern, so the exception was unnecessary. Verified with a tightened
style-src 'self' policy across editor, preview, presentation, and content
routes: zero CSP violations. No raw-HTML rendering path exists (react-markdown
runs without rehype-raw, no dangerouslySetInnerHTML), so markdown cannot inject
style attributes.
Resolved: 2026-07-16
```

## App-specific decisions

- Project backups use a versioned `.seriescreator` JSON file instead of raw
  unversioned `.json` exports.
- The primary output artifact is currently browser print/PDF, not PNG/JPG.
- Cloudflare Web Analytics is the hosting-provider analytics allowed by the
  standard. It is cookieless, documented in the privacy pages and restricted by
  the production CSP; project content is not sent to it.
- Browser E2E runs against the built production preview in Chromium, Firefox,
  WebKit and Mobile Chrome. WebKit is treated as an automated Safari-engine
  proxy, not as manual Safari.app or iPad proof.

- Development tooling temporarily overrides minimatch to `^11.0.1` because the
  ESLint/TypeScript-ESLint dependency ranges still select vulnerable 10.x.
  Lint, typecheck and tests validate the used API. Remove the override when
  those upstream ranges select a patched release themselves.
- Localized support information is served at `/unterstuetzung`; translation
  keys, nonempty values and placeholders are checked by the regular test gate.
