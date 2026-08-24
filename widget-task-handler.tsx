"use no memo";
import React from 'react';
import { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { VocabWidget } from './widget/VocabWidget';
import { VocabWidget2x1 } from './widget/VocabWidget2x1';
import { getCurrentWord, shuffleWord } from './src/vocabStore';

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetInfo = props.widgetInfo;
  
  // Fetch current word, but if action is SHUFFLE, pick a new one
  let word = await getCurrentWord();
  
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
