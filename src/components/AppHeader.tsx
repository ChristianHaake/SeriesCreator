import { GraduationCap } from "lucide-react";

export function AppHeader() {
  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand__text">
          <strong>SeriesCreator</strong>
          <small>Streaming-Projekte gestalten</small>
        </span>
      </div>
      <div className="app-header__controls">
        <button className="btn-header" aria-label="Lehrkräfte-Info" title="Für Lehrkräfte">
          <GraduationCap size={20} />
          <span>Für Lehrkräfte</span>
        </button>
      </div>
    </header>
  );
}
