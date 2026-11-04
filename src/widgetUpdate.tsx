"use no memo";
import React from 'react';
import { Platform } from 'react-native';
import { requestWidgetUpdate } from 'react-native-android-widget';

import { VocabWidget } from '../widget/VocabWidget';
import { VocabWidget2x1 } from '../widget/VocabWidget2x1';
import type { VocabWord } from './vocabStore';

// Re-render every home-screen widget (both sizes) with the given word.
export const updateAllWidgets = async (word: VocabWord | null) => {
  if (Platform.OS !== 'android') return;

  const english = word?.english || '';
  const thai = word?.thai || '';
  const pos = word?.pos || '';

  try {
    await Promise.all([
      requestWidgetUpdate({
        widgetName: 'VocabWidget',
        renderWidget: () => <VocabWidget english={english} thai={thai} pos={pos} />,
      }),
      requestWidgetUpdate({
        widgetName: 'VocabWidget2x1',
        renderWidget: () => <VocabWidget2x1 english={english} thai={thai} />,
      }),
    ]);
  } catch (e) {
    console.error('Widget update error', e);
  }
};
