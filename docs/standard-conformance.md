# haak3 Standard Conformance

Standard:
https://github.com/ChristianHaake/haak3-webapp-standard

Standard version: `1.0.0-draft`

Last reviewed: `2026-06-26`

## Exceptions

```text
Rule: Production CSP should avoid inline styles.
Reason: The current React UI still uses inline style props across editor,
preview, print, and presentation components. Removing them safely requires a
dedicated UI refactor.
Scope: public/_headers style-src includes 'unsafe-inline'.
Temporary or permanent: Temporary.
Review date: 2026-07-31
```

## App-specific decisions

- Project backups use a versioned `.seriescreator` JSON file instead of raw
  unversioned `.json` exports.
- The primary output artifact is currently browser print/PDF, not PNG/JPG.
