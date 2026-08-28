import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PrintLayout } from './PrintLayout';
import { initialProjectData } from '../types';

const labels = {
  completionLabel: 'Completion',
  castLabel: 'Cast:',
  genreLabel: 'Genre:',
  authorLabel: 'Author',
  episodesLabel: 'Episodes',
  noCoverLabel: 'No cover',
  noImageLabel: 'No image',
  episodeLearningDepthLabel: 'Academic deepening',
  reflectionLabel: 'Project Journey & Reflection',
  noReflectionLabel: 'No project journey or reflections entered yet.',
  customSectionLabel: 'Custom Section',
  sourcesLabel: 'Sources',
  noSourcesLabel: 'No sources entered yet.',
};

const seasons = [{
  id: 's1',
  title: 'Season 1',
  episodes: [{ id: 'ep1', title: 'Evidence', summary: 'Short description', learningDepth: 'Key claim with supporting evidence.' }],
}];

describe('PrintLayout', () => {
  it('prints a populated episode learning depth with its heading', () => {
    render(<PrintLayout data={{ ...initialProjectData, seasons }} {...labels} />);

    expect(screen.getByText('Academic deepening')).toBeInTheDocument();
    expect(screen.getByText('Key claim with supporting evidence.')).toBeInTheDocument();
  });

  it('prints the reflection, custom section and sources from the details step', () => {
    render(
      <PrintLayout
        data={{
          ...initialProjectData,
          seasons,
          reflection: 'We measured standby power for two weeks.',
          customConceptTitle: 'Method',
          customConceptText: 'Interviews plus meter readings.',
          sources: 'Class measurement log; German Environment Agency material.',
        }}
        {...labels}
      />,
    );

    expect(screen.getByText('Project Journey & Reflection')).toBeInTheDocument();
    expect(screen.getByText('We measured standby power for two weeks.')).toBeInTheDocument();
    expect(screen.getByText('Method')).toBeInTheDocument();
    expect(screen.getByText('Interviews plus meter readings.')).toBeInTheDocument();
    expect(screen.getByText('Sources')).toBeInTheDocument();
    expect(screen.getByText('Class measurement log; German Environment Agency material.')).toBeInTheDocument();
  });

  it('falls back to the empty-state labels when details are blank', () => {
    render(<PrintLayout data={{ ...initialProjectData, seasons, reflection: '', sources: '' }} {...labels} />);

    expect(screen.getByText('No project journey or reflections entered yet.')).toBeInTheDocument();
    expect(screen.getByText('No sources entered yet.')).toBeInTheDocument();
    expect(screen.queryByText('Custom Section')).not.toBeInTheDocument();
  });
});
