import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import '@fontsource/ibm-plex-sans-arabic/500.css';
import '@fontsource/ibm-plex-sans-arabic/700.css';
import '@fontsource/tajawal/500.css';
import '@fontsource/tajawal/700.css';
import '@fontsource/tajawal/800.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import { S1Opening, S2Hook, S3Enter, S4Hulk, S5AlQadi, S6Snap, S7Browse, S8Montage, S9Outro } from './scenes';
import meta from './meta.json';

// Master timeline (30 fps) — matches the brief's 55 s structure.
export const TIMELINE = [
  { name: 'S1 Opening', from: 0, dur: 150 }, // 00:00–00:05
  { name: 'S2 Hook', from: 150, dur: 120 }, // 00:05–00:09
  { name: 'S3 Enter', from: 270, dur: 180 }, // 00:09–00:15
  { name: 'S4 HULK', from: 450, dur: 270 }, // 00:15–00:24
  { name: 'S5 ALQadi', from: 720, dur: 270 }, // 00:24–00:33
  { name: 'S6 Snap', from: 990, dur: 150 }, // 00:33–00:38
  { name: 'S7 Browse', from: 1140, dur: 240 }, // 00:38–00:46
  { name: 'S8 Montage', from: 1380, dur: 150 }, // 00:46–00:51
  { name: 'S9 Outro', from: 1530, dur: 120 }, // 00:51–00:55
];
export const DURATION = 1650;

export const LufyStoreAd: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <Sequence from={0} durationInFrames={150}><S1Opening /></Sequence>
    <Sequence from={150} durationInFrames={120}><S2Hook /></Sequence>
    <Sequence from={270} durationInFrames={180}><S3Enter /></Sequence>
    <Sequence from={450} durationInFrames={270}><S4Hulk /></Sequence>
    <Sequence from={720} durationInFrames={270}><S5AlQadi /></Sequence>
    <Sequence from={990} durationInFrames={150}><S6Snap pageH={meta.snapPageH} scrollTo={meta.snapScrollTo} /></Sequence>
    <Sequence from={1140} durationInFrames={240}><S7Browse /></Sequence>
    <Sequence from={1380} durationInFrames={150}><S8Montage /></Sequence>
    <Sequence from={1530} durationInFrames={120}><S9Outro /></Sequence>
  </AbsoluteFill>
);
