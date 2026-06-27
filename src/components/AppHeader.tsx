import React from 'react';
import { CheckCircle2, Clapperboard, Download, GraduationCap, Trash2, Upload } from "lucide-react";
import type { ProjectData } from "../types";
import { useTranslation } from "../i18n";
import { parseProjectJson, PROJECT_FILE_EXTENSION } from '../domain/projectCodec';
import { resourceLimits } from '../domain/constraints';

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

    if (file.size > resourceLimits.projectFileBytes) {
      alert(locale === 'de' ? 'Projektdatei ist zu groß.' : 'Project file is too large.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = typeof e.target?.result === 'string' ? e.target.result : '';
      const parsed = parseProjectJson(content);
      if (parsed.ok) {
        onImport?.(parsed.data);
      } else {
        alert(parsed.message);
      }
      event.target.value = '';
    };
    reader.onerror = () => {
      alert(locale === 'de' ? 'Datei konnte nicht gelesen werden.' : 'File could not be read.');
      event.target.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand__mark" aria-hidden="true">
          <Clapperboard size={30} />
        </span>
        <span className="brand__panel">
          <span className="brand__text">
            <strong>{t.appTitle}</strong>
            <small>{t.appSubtitle}</small>
          </span>
        </span>
      </div>

      <div className="header-meta">
        <div className="header-meta__top">
          <div className="language-switcher" role="group" aria-label={t.languageLabel}>
            {(['de', 'en'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setLocale(option)}
                className={`language-switcher__option${locale === option ? ' is-active' : ''}`}
                aria-pressed={locale === option}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>

          <span className="local-badge">
            <CheckCircle2 aria-hidden="true" size={15} />
            <span>{t.localProcessing}</span>
          </span>
        </div>

        <div className="app-header__controls" role="toolbar" aria-label={t.headerActionsLabel}>
          {onReset && (
            <button type="button" className="btn-header ui-button ui-button--danger" onClick={onReset} aria-label={t.btnReset} title={t.btnReset}>
              <Trash2 size={18} />
              <span>{t.btnReset}</span>
            </button>
          )}
          {onExport && (
            <button type="button" className="btn-header ui-button" onClick={onExport} aria-label={t.btnSave} title={t.btnSave}>
              <Download size={18} />
              <span>{t.btnSave}</span>
            </button>
          )}
          {onImport && (
            <label className="btn-header ui-button" style={{ cursor: 'pointer', margin: 0 }} title={t.btnLoad}>
              <Upload size={18} />
              <span>{t.btnLoad}</span>
              <input
                type="file"
                accept={`.${PROJECT_FILE_EXTENSION},.json,application/json`}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </label>
          )}
          <a href="/lehrkraefte" className="btn-header ui-button" aria-label={t.btnTeachers} title={t.btnTeachers}>
            <GraduationCap size={18} />
            <span>{t.btnTeachers}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
