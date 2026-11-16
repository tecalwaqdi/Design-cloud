import React from 'react';
import { Composition } from 'remotion';
import { DURATION, LufyStoreAd } from './Ad';

export const Root: React.FC = () => (
  <Composition id="LufyStoreAd" component={LufyStoreAd} durationInFrames={DURATION} fps={30} width={1080} height={1920} />
);
