import { describe, expect, it, jest } from '@jest/globals';

import { render, screen } from '../../test-utils';
import Icon from '../Icon';
import type { IconSource } from '../Icon';

// Icon reads the platform when its module loads, so setting `Platform.OS` in a
// test is too late. The whole file runs as web instead.
jest.mock('react-native/Libraries/Utilities/Platform', () => {
  const { default: Platform } = jest.requireActual<{
    default: { OS: string };
  }>('react-native/Libraries/Utilities/Platform');
  Platform.OS = 'web';
  return { __esModule: true, default: Platform };
});

const ICON_SIZE = 24;

describe('Icon on web', () => {
  it.each<[string, IconSource]>([
    ['a glyph icon', 'camera'],
    ['an image icon', { uri: 'https://picsum.photos/700' }],
  ])('hides %s from assistive technology', async (_, source) => {
    await render(<Icon source={source} size={ICON_SIZE} testID="icon" />);

    expect(
      screen.getByTestId('icon', { includeHiddenElements: true })
    ).toBeOnTheScreen();
    expect(screen.queryByTestId('icon')).not.toBeOnTheScreen();
  });
});
