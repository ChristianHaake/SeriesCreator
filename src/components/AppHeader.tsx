import React, { useRef, useState } from 'react';
import { CheckCircle2, MoreHorizontal, Download, FileText, GraduationCap, Trash2, Upload, Printer } from "lucide-react";
import type { ProjectData } from "../types";
import { useTranslation } from "../i18n";
import { PROJECT_FILE_EXTENSION } from '../domain/projectCodec';
import { resourceLimits } from '../domain/constraints';
import { parseProjectTextInWorker } from '../domain/projectImport';
import { BrandLogo } from './BrandLogo';

interface Props {
  onExport?: () => void;
  onHtmlExport?: () => void;
  onImport?: (data: ProjectData) => void;
  onImportStart?: () => void;
  onImportError?: (message: string) => void;
  onShowExamples?: () => void;
  onReset?: () => void;
  onPrint?: () => void;
}

export function AppHeader({
  onExport,
  onHtmlExport,
  onImport,
  onImportStart,
  onImportError,
  onShowExamples,
  onReset,
  onPrint,
}: Props) {
  const { t, locale, setLocale } = useTranslation();
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > resourceLimits.projectFileBytes) {
      onImportError?.(t.msgProjectTooLarge);
      input.value = '';
      return;
    }

    setIsImporting(true);
    onImportStart?.();
    try {
      const content = await file.text();
      const parsed = await parseProjectTextInWorker(content);
      if (parsed.ok) {
        onImport?.(parsed.data);
      } else {
        onImportError?.(parsed.message);
      }
    } catch {
      onImportError?.(t.msgImportReadFailed);
    } finally {
      input.value = '';
      setIsImporting(false);
    }
  };

  return (
    <header className="app-header">
      <a href="/" className="brand" aria-label={t.appTitle} title={t.appSubtitle}>
        <BrandLogo className="brand__logo" />
      </a>

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
            <CheckCircle2 aria-hidden="true" size={16} strokeWidth={2.5} />
            <span>{t.localProcessing}</span>
          </span>
        </div>

        <div className="app-header__controls" role="toolbar" aria-label={t.headerActionsLabel}>
          {/* Save stays out of the menu: this app has no accounts and no server
              copy, so the action that preserves work must never be buried. */}
          {onExport && (
            <button type="button" className="btn-header ui-button" onClick={onExport} aria-label={t.btnSave} title={t.btnSave}>
              <Download size={16} />
              <span>{t.btnSave}</span>
            </button>
          )}

          <button
            type="button"
            className="btn-header ui-button header-actions__toggle"
            popoverTarget="header-actions-menu"
            aria-label={t.moreActions}
            title={t.moreActions}
          >
            <MoreHorizontal size={16} />
          </button>

          {/* A native popover: Escape, light dismiss and top-layer stacking come
              from the platform. On wide viewports CSS renders it inline instead,
              so the desktop toolbar is unchanged and the toggle is hidden. */}
          <div id="header-actions-menu" popover="auto" className="header-actions__menu">
            {onImport && (
              <>
                <button
                  type="button"
                  className="btn-header ui-button"
                  onClick={() => importInputRef.current?.click()}
                  aria-label={t.btnLoad}
                  title={t.btnLoad}
                  disabled={isImporting}
                  aria-busy={isImporting || undefined}
                >
                  <Upload size={16} />
                  <span>{t.btnLoad}</span>
                </button>
                <input
                  ref={importInputRef}
                  type="file"
                  accept={`.${PROJECT_FILE_EXTENSION},.json,application/json`}
                  className="visually-hidden"
                  aria-label={t.btnLoad}
                  tabIndex={-1}
                  onChange={handleFileUpload}
                  disabled={isImporting}
                />
              </>
            )}
            {onShowExamples && (
              <button type="button" className="btn-header ui-button" onClick={onShowExamples} aria-label={t.btnExamples} title={t.btnExamples}>
                <FileText size={16} />
                <span>{t.btnExamples}</span>
              </button>
            )}
            {onHtmlExport && (
              <button type="button" className="btn-header ui-button" onClick={onHtmlExport} aria-label={t.btnHtml} title={t.btnHtml}>
                <Download size={16} />
                <span>{t.btnHtml}</span>
              </button>
            )}
            {onPrint && (
              <button type="button" className="btn-header ui-button" onClick={onPrint} aria-label={t.btnPdf} title={t.btnPdf}>
                <Printer size={16} />
                <span>{t.btnPdf}</span>
              </button>
            )}
            <a href="/lehrkraefte" className="btn-header ui-button" aria-label={t.btnTeachers} title={t.btnTeachers}>
              <GraduationCap size={16} />
              <span>{t.btnTeachers}</span>
            </a>
            {/* Destructive, so it sits last rather than first as it did before. */}
            {onReset && (
              <button type="button" className="btn-header ui-button ui-button--danger" onClick={onReset} aria-label={t.btnReset} title={t.btnReset}>
                <Trash2 size={16} />
                <span>{t.btnReset}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
