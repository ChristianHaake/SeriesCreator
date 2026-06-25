import { GraduationCap, Download, Upload } from "lucide-react";
import type { ProjectData } from "../types";

interface Props {
  onExport?: () => void;
  onImport?: (data: ProjectData) => void;
}

export function AppHeader({ onExport, onImport }: Props) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed && typeof parsed === 'object' && 'title' in parsed && 'seasons' in parsed) {
          if (onImport) onImport(parsed);
        } else {
          alert('Ungültiges Projektformat.');
        }
      } catch (err) {
        alert('Fehler beim Lesen der Datei.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand__text">
          <strong>SeriesCreator</strong>
          <small>Streaming-Projekte gestalten</small>
        </span>
      </div>
      <div className="app-header__controls" style={{ display: 'flex', gap: '1rem' }}>
        {onExport && (
          <button className="btn-header" onClick={onExport} aria-label="Projekt speichern" title="Als JSON speichern">
            <Download size={20} />
            <span>Speichern</span>
          </button>
        )}
        {onImport && (
          <label className="btn-header" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }} title="Projekt aus JSON laden">
            <Upload size={20} />
            <span>Laden</span>
            <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileUpload} />
          </label>
        )}
        <button className="btn-header" aria-label="Lehrkräfte-Info" title="Für Lehrkräfte">
          <GraduationCap size={20} />
          <span>Für Lehrkräfte</span>
        </button>
      </div>
    </header>
  );
}
