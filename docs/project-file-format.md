# SeriesCreator project format

## Identity

- Extension: `.seriescreator`
- Media type: `application/json`
- Current schema: `3`
- Maximum file size: 25,000,000 bytes
- Encoding: UTF-8 JSON

## Root object

```text
schemaVersion        number, required
title                string, max 100
author               string, max 120
description          string, max 2000
coverUrl             optional validated image data URL
previewBrand         string, max 60
previewCategory      string, max 60
matchPercentage      legacy number, clamped to 0–100
completionOverride   optional number, clamped to 0–100
ageRating            string, max 40
genre                string, max 80
cast                 string, max 200
seasons              array, 1–20
reflection           optional string, max 5000
sources              optional string, max 5000
customConceptTitle   optional string, max 100
customConceptText    optional string, max 5000
```

Each season has an ID, a title of at most 60 characters, and 0–100 episodes.
Each episode has an ID, title, summary, optional `learningDepth` text (max
5,000 characters), optional image data URL, optional alternative text, and up
to 20 optional content blocks. A text block has an ID, an optional title (max
100 characters), and body text (max 5,000 characters). An image block has an
ID, validated image data URL, alternative text, and an optional caption (max
250 characters).

## Images

Embedded images must be base64 data URLs with one of these media types:

- `image/png`
- `image/jpeg`
- `image/jpg`
- `image/webp`

Each data URL is limited to 1,500,000 characters. Invalid image values are
discarded during normalization.

## Compatibility

- Schema-1 and schema-2 files (and files without `schemaVersion`) are migrated
  to schema 3 during full normalization. The migration preserves existing
  episode data and leaves missing optional fields unset.
- Older SeriesCreator versions reject newer schema versions instead of loading
  and silently dropping episode fields.
- Future schema versions are rejected.
- Invalid season or episode shapes reject the complete import.
- Unknown fields are discarded.
- Import failure never replaces the current project.

`src/domain/projectCodec.ts` is the executable source of truth. Format changes
must update the schema number or an explicit migration, tests, examples and
this document together.
