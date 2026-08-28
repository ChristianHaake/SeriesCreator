import { useState, useEffect, useMemo, type KeyboardEvent } from 'react';
import { useProjectStore } from './store/useProjectStore';
import { Presentation } from 'lucide-react';
import { EditorSidebar } from './components/EditorSidebar';
import { EpisodeGrid } from './components/EpisodeGrid';
import { PresentationMode } from './components/PresentationMode';
import { PrintLayout } from './components/PrintLayout';

import { AppHeader } from './components/AppHeader';
import { AppFooter } from './components/AppFooter';
import { ExampleGallery } from './components/ExampleGallery';
import { ConfirmDialog } from './components/ConfirmDialog';
import { useTranslation } from './i18n';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { contentPages, type ContentPath, isContentPath } from './content';
import {
  isProjectFileSizeWithinLimit,
  makeExportBaseName,
  makeProjectFilename,
  PROJECT_FILE_MIME_TYPE,
  serializeProject,
} from './domain/projectCodec';
import { exportProjectToHtml } from './domain/exportHtml';
import { getExampleProjects, type ExampleProjectId } from './domain/exampleProjects';
import { attachExampleImages } from './domain/exampleImageAssets';
import { displayCompletion } from './domain/completion';
import './index.css';

function ContentPage({ pathname }: { pathname: ContentPath }) {
  const { locale, t } = useTranslation();
  const page = contentPages[locale][pathname];
  
  return (
    <main className="content-page">
      <a href="/" className="content-page__back">{t.backToApp}</a>
      <div className="markdown-content">
        <h1>{page.title}</h1>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{page.content}</ReactMarkdown>
      </div>
    </main>
  );
}

type PreviewTab = 'EPISODEN' | 'DETAILS' | 'QUELLEN';
type MobilePanel = 'editor' | 'preview';
type StatusTone = 'success' | 'error' | 'info';
type AppStatus = { message: string; tone: StatusTone } | null;
const previewTabOrder: PreviewTab[] = ['EPISODEN', 'DETAILS', 'QUELLEN'];

function App() {
  const { t, locale } = useTranslation();
  const [status, setStatus] = useState<AppStatus>(null);
  const store = useProjectStore(() =>
    setStatus({ message: t.msgSaveFailed, tone: 'error' }),
  );
  const { data, replaceData, resetData } = store;
  const [activeSeasonId, setActiveSeasonId] = useState(data.seasons[0]?.id || '');
  const [activeTab, setActiveTab] = useState<PreviewTab>('EPISODEN');
  const [showPresentation, setShowPresentation] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname.replace(/\/+$/, "") || "/");
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('editor');
  // Pending destructive action awaiting confirmation in the dialog.
  const [pendingAction, setPendingAction] = useState<
    { message: string; confirmLabel: string; run: () => void } | null
  >(null);
  const examples = useMemo(() => getExampleProjects(locale), [locale]);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname.replace(/\/+$/, "") || "/");
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Keep the tab title on the current page and the description in the current
  // language. The og:/twitter: tags stay static — social scrapers read the
  // served HTML and never run this.
  useEffect(() => {
    const page = isContentPath(currentPath) ? contentPages[locale][currentPath] : null;
    document.title = page ? `${page.title} · SeriesCreator` : 'SeriesCreator';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', t.metaDescription);
  }, [currentPath, locale, t.metaDescription]);


  const activeSeason = data.seasons.find(s => s.id === activeSeasonId) || data.seasons[0];
  const completion = displayCompletion(data);

  const showStatus = (message: string, tone: StatusTone = 'success') => {
    setStatus({ message, tone });
  };

  const handlePreviewTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentTab: PreviewTab,
  ) => {
    const currentIndex = previewTabOrder.indexOf(currentTab);
    let nextIndex = currentIndex;

    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % previewTabOrder.length;
    if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + previewTabOrder.length) % previewTabOrder.length;
    }
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = previewTabOrder.length - 1;
    if (nextIndex === currentIndex) return;

    event.preventDefault();
    const nextTab = previewTabOrder[nextIndex];
    setActiveTab(nextTab);
    document.getElementById(`tab-${nextTab.toLowerCase()}`)?.focus();
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    try {
      window.print();
      showStatus(t.msgPrintStarted, 'info');
    } catch {
      showStatus(t.msgExportFailed, 'error');
    }
  };

  const handleHtmlExport = () => {
    try {
      const htmlContent = exportProjectToHtml(data, t, locale);
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const filename = `${makeExportBaseName(data.title, 'SeriesCreator-Praesentation')}.html`;
      downloadBlob(blob, filename);
      showStatus(t.msgHtmlExportSuccess, 'success');
    } catch {
      showStatus(t.msgExportFailed, 'error');
    }
  };

  const handleExampleChoose = async (id: ExampleProjectId) => {
    const example = examples.find((item) => item.id === id);
    if (!example) return;

    const loadExample = async () => {
      try {
        const exampleProject = await attachExampleImages(example.project, example.id);
        replaceData(exampleProject);
        setActiveSeasonId(exampleProject.seasons[0]?.id || '');
        setActiveTab('EPISODEN');
        setMobilePanel('preview');
        setShowExamples(false);
        showStatus(t.msgExampleLoaded, 'success');
      } catch {
        showStatus(t.msgExampleLoadFailed, 'error');
      }
    };

    setPendingAction({
      message: t.confirmLoadExample,
      confirmLabel: t.btnLoadExample,
      run: () => { void loadExample(); },
    });
  };

  if (showPresentation) {
    return <PresentationMode data={data} onClose={() => setShowPresentation(false)} />;
  }

  if (isContentPath(currentPath)) {
    return (
      <div className="app-shell app-shell--content-route">
        <AppHeader />
        <ContentPage pathname={currentPath} />
        <AppFooter />
      </div>
    );
  }

  return (
    <div className={`app-shell app-shell--mobile-${mobilePanel}`}>
      <a className="skip-link" href="#editor-panel">{t.skipToEditor}</a>
      <AppHeader
        onExport={() => {
          try {
            if (!isProjectFileSizeWithinLimit(data)) {
              showStatus(t.msgProjectTooLarge, 'error');
              return;
            }
            const blob = new Blob([serializeProject(data)], {
              type: PROJECT_FILE_MIME_TYPE,
            });
            downloadBlob(blob, makeProjectFilename(data.title));
            showStatus(t.msgExportSuccess, 'success');
          } catch {
            showStatus(t.msgExportFailed, 'error');
          }
        }}
        onHtmlExport={handleHtmlExport}
        onPrint={handleExport}
        onImport={(importedData) => {
          replaceData(importedData);
          setActiveSeasonId(importedData.seasons[0]?.id || '');
          showStatus(t.msgImportSuccess, 'success');
        }}
        onImportStart={() => showStatus(t.msgImporting, 'info')}
        onImportError={(message) => showStatus(message, 'error')}
        onShowExamples={() => setShowExamples(true)}
        onReset={() => setPendingAction({
          message: t.confirmReset,
          confirmLabel: t.btnDelete,
          run: resetData,
        })}
      />
      {pendingAction && (
        <ConfirmDialog
          message={pendingAction.message}
          confirmLabel={pendingAction.confirmLabel}
          destructive
          onConfirm={() => { pendingAction.run(); setPendingAction(null); }}
          onCancel={() => setPendingAction(null)}
        />
      )}
      {showExamples && (
        <ExampleGallery
          examples={examples}
          onChoose={handleExampleChoose}
          onClose={() => setShowExamples(false)}
        />
      )}
      <div
        className={`app-status${status ? ` app-status--${status.tone}` : ''}`}
        role="status"
        aria-live="polite"
      >
        {status?.message}
      </div>
      <div className="mobile-panel-switch" role="group" aria-label={t.mobilePanelSwitchLabel}>
        <button
          type="button"
          className={mobilePanel === 'editor' ? 'is-active' : ''}
          aria-pressed={mobilePanel === 'editor'}
          onClick={() => setMobilePanel('editor')}
        >
          {t.mobilePanelEditor}
        </button>
        <button
          type="button"
          className={mobilePanel === 'preview' ? 'is-active' : ''}
          aria-pressed={mobilePanel === 'preview'}
          onClick={() => setMobilePanel('preview')}
        >
          {t.mobilePanelPreview}
        </button>
      </div>
      <div className="app-main-content">
        {/* Hidden layout purely used for the high-res PDF snapshot */}
        <PrintLayout
          data={data}
          completionLabel={t.completionMeta}
          castLabel={t.castPrefix}
          genreLabel={t.genrePrefix}
          authorLabel={t.lblAuthor}
          episodesLabel={t.tabEpisodes}
          noCoverLabel={t.noCover}
          noImageLabel={t.noImage}
          episodeLearningDepthLabel={t.episodeLearningDepthLabel}
          reflectionLabel={t.lblReflection}
          noReflectionLabel={t.noReflection}
          customSectionLabel={t.lblCustomSection}
          sourcesLabel={t.lblSources}
          noSourcesLabel={t.noSources}
        />

      {/* Sidebar Editor */}
      <EditorSidebar 
        activeSeasonId={activeSeasonId} 
        setActiveSeasonId={setActiveSeasonId} 
        store={store}
      />

        {/* Main Preview */}
        <main className="preview-main theme-streaming" aria-label={t.mobilePanelPreview}>
        {/* Decorative streaming chrome: it imitates a nav bar but navigates
            nowhere, so it is hidden from assistive tech like the cover art. */}
        <header className="preview-header" aria-hidden="true">
          <div className="preview-header__brand">{data.previewBrand || 'SeriesCreator'}</div>
          <div className="preview-header__nav">
            <span>{t.home}</span>
            <strong>{t.series}</strong>
            <span>{data.previewCategory || t.categoryFallback}</span>
          </div>
        </header>

        <section className="streaming-hero" style={{ backgroundImage: data.coverUrl ? `url(${data.coverUrl})` : 'none', backgroundColor: data.coverUrl ? 'transparent' : '#222' }}>
          <div className="streaming-hero-content">
            <h1 className="streaming-title">{data.title || t.titlePlaceholder}</h1>
            
            <div className="streaming-meta">
              <span className="completion-score">{t.completionMeta} {completion}%</span>
              <span>{new Date().getFullYear()}</span>
              <span className="age-rating">{data.ageRating || "Klasse"}</span>
              <span>{data.seasons.length} {data.seasons.length === 1 ? t.season : t.seasonPlural}</span>
            </div>

            <p className="streaming-desc">
              {data.description || t.descPlaceholder}
            </p>

            <div className="streaming-actions">
              <button type="button" className="btn-play" onClick={() => setShowPresentation(true)}>
                <Presentation aria-hidden="true" size={24} strokeWidth={2.5} /> {t.btnPlay}
              </button>
            </div>

            <div className="streaming-facts">
              {data.author && <p><span>{t.lblAuthor}:</span> {data.author}</p>}
              <p><span>{t.castPrefix}</span> {data.cast}</p>
              <p><span>{t.genrePrefix}</span> {data.genre}</p>
            </div>
          </div>
        </section>

        <section className="preview-section">
          <div className="preview-tabs" role="tablist" aria-label={t.ariaSeriesArea}>
            <button
              type="button"
              role="tab"
              id="tab-episoden"
              aria-controls="panel-episoden"
              aria-selected={activeTab === 'EPISODEN'}
              tabIndex={activeTab === 'EPISODEN' ? 0 : -1}
              onClick={() => setActiveTab('EPISODEN')}
              onKeyDown={(event) => handlePreviewTabKeyDown(event, 'EPISODEN')}
            >
              {t.tabEpisodes}
            </button>
            <button
              type="button"
              role="tab"
              id="tab-details"
              aria-controls="panel-details"
              aria-selected={activeTab === 'DETAILS'}
              tabIndex={activeTab === 'DETAILS' ? 0 : -1}
              onClick={() => setActiveTab('DETAILS')}
              onKeyDown={(event) => handlePreviewTabKeyDown(event, 'DETAILS')}
            >
              {t.tabBackground}
            </button>
            <button
              type="button"
              role="tab"
              id="tab-quellen"
              aria-controls="panel-quellen"
              aria-selected={activeTab === 'QUELLEN'}
              tabIndex={activeTab === 'QUELLEN' ? 0 : -1}
              onClick={() => setActiveTab('QUELLEN')}
              onKeyDown={(event) => handlePreviewTabKeyDown(event, 'QUELLEN')}
            >
              {t.tabSources}
            </button>
          </div>

          {activeTab === 'EPISODEN' && (
            <div role="tabpanel" id="panel-episoden" aria-labelledby="tab-episoden" tabIndex={0}>
              <div className="season-selector">
                <select
                  value={activeSeasonId}
                  onChange={(e) => setActiveSeasonId(e.target.value)}
                  aria-label={t.selSeasonLabel}
                >
                  {data.seasons.map(s => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>

              {activeSeason && <EpisodeGrid episodes={activeSeason.episodes} />}
            </div>
          )}

          {activeTab === 'DETAILS' && (
            <div className="preview-text-panel" role="tabpanel" id="panel-details" aria-labelledby="tab-details" tabIndex={0}>
              <h3>{t.lblReflection}</h3>
              <p>{data.reflection || t.noReflection}</p>
              
              {(data.customConceptTitle || data.customConceptText) && (
                <div style={{ marginTop: '2.5rem' }}>
                  <h3>{data.customConceptTitle || t.lblCustomSection}</h3>
                  <p>{data.customConceptText}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'QUELLEN' && (
            <div className="preview-text-panel" role="tabpanel" id="panel-quellen" aria-labelledby="tab-quellen" tabIndex={0}>
              <h3>{t.lblSources}</h3>
              <p>{data.sources || t.noSources}</p>
            </div>
          )}
        </section>
        </main>
      </div>
      <AppFooter />
    </div>
  );
}

export default App;
