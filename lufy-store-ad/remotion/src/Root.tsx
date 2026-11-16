import React from 'react';
import { Composition, AbsoluteFill } from 'remotion';
import '@fontsource/ibm-plex-sans-arabic/700.css';
const Test: React.FC = () => (
  <AbsoluteFill style={{ background: '#07020f', color: '#fff', justifyContent: 'center', alignItems: 'center', fontFamily: 'IBM Plex Sans Arabic', fontSize: 90, direction: 'rtl' }}>
    في عزّ الحماس… وفجأة كل شي وقف؟!
  </AbsoluteFill>
);
export const Root: React.FC = () => (
  <Composition id="Test" component={Test} durationInFrames={30} fps={30} width={1080} height={1920} />
);
