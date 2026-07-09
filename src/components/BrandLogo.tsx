interface Props {
  className?: string;
  title: string;
}

// Inline wordmark so the header brand never depends on a raster asset.
// Mirrors the square app logo: grey tile + blue play mark, "Series" navy + "Creator" teal.
export function BrandLogo({ className, title }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 214 60"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="6" width="48" height="48" rx="9" fill="#d7dade" />
      <circle cx="26" cy="30" r="16" fill="#0056b3" />
      <path d="M21 22.5v15l12.5-7.5z" fill="#ffffff" />
      <text
        x="60"
        y="28"
        fill="#0f2a4d"
        fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif"
        fontSize="25"
        fontWeight="800"
        letterSpacing="-0.5"
      >
        Series
      </text>
      <text
        x="60"
        y="52"
        fill="#17a37a"
        fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif"
        fontSize="25"
        fontWeight="800"
        letterSpacing="-0.5"
      >
        Creator
      </text>
    </svg>
  );
}
