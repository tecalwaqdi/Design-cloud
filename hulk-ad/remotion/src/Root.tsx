import React from 'react';
import { Composition } from 'remotion';
import { DURATION, HulkAd } from './HulkAd';

export const Root: React.FC = () => (
  <Composition id="HulkAd" component={HulkAd} durationInFrames={DURATION} fps={30} width={1080} height={1920} />
);
