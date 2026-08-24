"use no memo";
import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface VocabWidgetProps {
  english: string;
  thai: string;
  pos: string;
}

export function VocabWidget({ english, thai, pos }: VocabWidgetProps) {
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      }}
    >
      <FlexWidget
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 'match_parent',
          marginBottom: 8,
        }}
      >
        <TextWidget
          text="Daily Vocab"
          style={{
            fontSize: 12,
            fontFamily: 'sans-serif-medium',
            color: '#6c5ce7',
          }}
        />
        <FlexWidget clickAction="SHUFFLE_WORD" style={{ padding: 4 }}>
          <TextWidget
            text="↻"
            style={{
              fontSize: 16,
              fontFamily: 'sans-serif-black',
              color: '#6c5ce7',
            }}
          />
        </FlexWidget>
      </FlexWidget>

      <TextWidget
        text={english || 'No Word'}
        style={{
          fontSize: 22,
          fontFamily: 'sans-serif-black',
          color: '#1A252C',
          marginBottom: 4,
        }}
      />

      {pos ? (
        <FlexWidget
          style={{
            backgroundColor: '#f1f2f6',
            borderRadius: 4,
            paddingHorizontal: 6,
            paddingVertical: 2,
            marginBottom: 8,
          }}
        >
          <TextWidget
            text={pos}
            style={{
              fontSize: 10,
              fontFamily: 'sans-serif-medium',
              color: '#6c5ce7',
            }}
          />
        </FlexWidget>
      ) : null}

      <TextWidget
        text={thai || 'Upload a CSV to start'}
        style={{
          fontSize: 16,
          fontFamily: 'sans-serif-medium',
          color: '#34495E',
        }}
      />
    </FlexWidget>
  );
}
