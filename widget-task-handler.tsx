"use no memo";
import React from 'react';
import { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { VocabWidget } from './widget/VocabWidget';
import { VocabWidget2x1 } from './widget/VocabWidget2x1';
import { checkAndShuffleDaily, getCurrentWord, shuffleWord } from './src/vocabStore';

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetInfo = props.widgetInfo;

  // On periodic updates / when added, apply the daily shuffle so the widget
  // changes each day even if the app is never opened.
  let word =
    props.widgetAction === 'WIDGET_UPDATE' || props.widgetAction === 'WIDGET_ADDED'
      ? await checkAndShuffleDaily()
      : await getCurrentWord();

  if (props.widgetAction === 'WIDGET_CLICK' && props.clickAction === 'SHUFFLE_WORD') {
    const newWord = await shuffleWord();
    if (newWord) {
      word = newWord;
    }
  }

  const widgetName = widgetInfo.widgetName;

  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED':
    case 'WIDGET_CLICK':
      if (widgetName === 'VocabWidget2x1') {
        props.renderWidget(
          <VocabWidget2x1
            english={word?.english || ''}
            thai={word?.thai || ''}
          />
        );
      } else {
        props.renderWidget(
          <VocabWidget 
            english={word?.english || ''}
            thai={word?.thai || ''}
            pos={word?.pos || ''}
          />
        );
      }
      break;
    default:
      break;
  }
}
