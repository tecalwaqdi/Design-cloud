import React from 'react';
import { Composition } from 'remotion';
import { DURATION, WeekendAd } from './WeekendAd';

export const Root: React.FC = () => (
  <Composition id="WeekendAd" component={WeekendAd} durationInFrames={DURATION} fps={30} width={1080} height={1920} />
);
