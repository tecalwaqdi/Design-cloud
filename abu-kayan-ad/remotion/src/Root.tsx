import React from 'react';
import { Composition } from 'remotion';
import { AbuKayanAd, DURATION } from './AbuKayanAd';

export const Root: React.FC = () => (
  <Composition id="AbuKayanAd" component={AbuKayanAd} durationInFrames={DURATION} fps={30} width={1080} height={1920} />
);
