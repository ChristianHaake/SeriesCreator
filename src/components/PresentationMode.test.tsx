import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { LocaleProvider } from '../i18n';
import { initialProjectData } from '../types';
import { PresentationMode } from './PresentationMode';

describe('PresentationMode', () => {
  it('renders image content blocks after their episode', async () => {
    const user = userEvent.setup();
    const data = structuredClone(initialProjectData);
    data.seasons[0].episodes = [{
      id: 'episode-1',
      title: 'Episode with evidence',
      summary: 'Summary',
      contentBlocks: [{
        id: 'image-1',
        type: 'image',
        imageUrl: 'data:image/png;base64,AAAA',
        altText: 'Temperature chart',
        caption: 'Measured values',
      }],
    }];

    render(
      <LocaleProvider>
        <PresentationMode data={data} onClose={() => {}} />
      </LocaleProvider>,
    );

    const next = screen.getByRole('button', { name: 'Next Slide' });
    await user.click(next);
    await user.click(next);
    await user.click(next);

    expect(screen.getByRole('img', { name: 'Temperature chart' })).toHaveAttribute(
      'src',
      'data:image/png;base64,AAAA',
    );
    expect(screen.getByText('Measured values')).toBeInTheDocument();
  });
});
