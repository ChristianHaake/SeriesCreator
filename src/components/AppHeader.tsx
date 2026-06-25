import React from 'react';
import { GraduationCap, Download, Upload, Trash2 } from "lucide-react";
import type { ProjectData } from "../types";
import { useTranslation } from "../i18n";

interface Props {
  onExport?: () => void;
  onImport?: (data: ProjectData) => void;
  onReset?: () => void;
}

export function AppHeader({ onExport, onImport, onReset }: Props) {
  const { t, locale, setLocale } = useTranslation();
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
          <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--color-bg-workspace)', padding: '4px', borderRadius: '6px' }}>
          <button 
            onClick={() => setLocale('de')}
            style={{ padding: '4px 8px', border: 'none', background: locale === 'de' ? 'white' : 'transparent', borderRadius: '4px', cursor: 'pointer', fontWeight: locale === 'de' ? 'bold' : 'normal', boxShadow: locale === 'de' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none' }}
          >DE</button>
          <button 
            onClick={() => setLocale('en')}
            style={{ padding: '4px 8px', border: 'none', background: locale === 'en' ? 'white' : 'transparent', borderRadius: '4px', cursor: 'pointer', fontWeight: locale === 'en' ? 'bold' : 'normal', boxShadow: locale === 'en' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none' }}
          >EN</button>
        </div>
        </div>
      </div>
    </header>
  );
}
