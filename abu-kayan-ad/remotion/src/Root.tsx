import React from 'react';
import { Composition } from 'remotion';
import { AbuKayanAd, DURATION } from './AbuKayanAd';
import { AbuKayanV3A, V3A_DURATION } from './V3A';

export const Root: React.FC = () => (
  <>
    <Composition id="AbuKayanAd" component={AbuKayanAd} durationInFrames={DURATION} fps={30} width={1080} height={1920} />
    <Composition id="AbuKayanV3A" component={AbuKayanV3A} durationInFrames={V3A_DURATION} fps={30} width={1080} height={1920} />
  </>
);
