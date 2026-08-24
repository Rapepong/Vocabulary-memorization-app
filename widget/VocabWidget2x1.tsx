"use no memo";
import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface VocabWidgetProps {
  english: string;
  thai: string;
}

export function VocabWidget2x1({ english, thai }: VocabWidgetProps) {
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <FlexWidget
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          flex: 1,
        }}
      >
        <TextWidget
          text={english || 'No Word'}
          style={{
            fontSize: 16,
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            color: '#1A252C',
            marginBottom: 2,
          }}
          maxLines={1}
          truncate="END"
        />
        <TextWidget
          text={thai || 'Upload a CSV to start'}
          style={{
            fontSize: 12,
            fontFamily: 'sans-serif-medium',
            color: '#34495E',
          }}
          maxLines={1}
          truncate="END"
        />
      </FlexWidget>
      
      <FlexWidget clickAction="SHUFFLE_WORD" style={{ padding: 8 }}>
        <TextWidget
          text="↻"
          style={{
            fontSize: 18,
            fontFamily: 'sans-serif-black',
            color: '#6c5ce7',
          }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}
