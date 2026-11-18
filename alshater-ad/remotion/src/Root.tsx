import React from 'react';
import { Composition } from 'remotion';
import { AlshaterAd, DURATION } from './Ad';

export const Root: React.FC = () => (
  <Composition id="AlshaterAd" component={AlshaterAd} durationInFrames={DURATION} fps={30} width={1080} height={1920} />
);
