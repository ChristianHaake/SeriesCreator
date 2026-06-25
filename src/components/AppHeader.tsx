import { GraduationCap, Download, Upload, Trash2, Globe } from "lucide-react";
import type { ProjectData } from "../types";
import { translations, type Language } from "../translations";

interface Props {
  lang: Language;
  setLang: (l: Language) => void;
  onExport?: () => void;
  onImport?: (data: ProjectData) => void;
  onReset?: () => void;
}

export function AppHeader({ lang, setLang, onExport, onImport, onReset }: Props) {
  const t = translations[lang];
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
          <strong>{t.appTitle}</strong>
          <small>{t.appSubtitle}</small>
        </span>
      </div>
      <div className="app-header__controls" style={{ display: 'flex', gap: '1rem' }}>
        {onReset && (
          <button className="btn-header" onClick={onReset} aria-label={t.btnReset} title={t.btnReset}>
            <Trash2 size={20} color="#E50914" />
            <span style={{ color: '#E50914' }}>{t.btnReset}</span>
          </button>
        )}
        {onExport && (
          <button className="btn-header" onClick={onExport} aria-label={t.btnSave} title={t.btnSave}>
            <Download size={20} />
            <span>{t.btnSave}</span>
          </button>
        )}
        {onImport && (
          <label className="btn-header" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }} title={t.btnLoad}>
            <Upload size={20} />
            <span>{t.btnLoad}</span>
            <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileUpload} />
          </label>
        )}
        <a href="#/lehrkraefte" className="btn-header" aria-label={t.btnTeachers} title={t.btnTeachers} style={{ textDecoration: 'none' }}>
          <GraduationCap size={20} />
          <span>{t.btnTeachers}</span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem' }}>
          <Globe size={16} color="var(--color-text-muted)" />
          <button 
            onClick={() => setLang('de')} 
            style={{ background: 'none', border: 'none', color: lang === 'de' ? 'white' : 'var(--color-text-muted)', fontWeight: lang === 'de' ? 'bold' : 'normal', cursor: 'pointer', padding: '0 0.2rem' }}
          >DE</button>
          <span style={{ color: 'var(--color-text-muted)' }}>|</span>
          <button 
            onClick={() => setLang('en')} 
            style={{ background: 'none', border: 'none', color: lang === 'en' ? 'white' : 'var(--color-text-muted)', fontWeight: lang === 'en' ? 'bold' : 'normal', cursor: 'pointer', padding: '0 0.2rem' }}
          >EN</button>
        </div>
      </div>
    </header>
  );
}
