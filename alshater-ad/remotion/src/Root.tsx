import React from 'react';
import { Composition, Still } from 'remotion';
import { AlshaterAd, DURATION } from './Ad';
import { SoftwarePost, SoftwareStory } from './Software';

export const Root: React.FC = () => (
  <>
    <Composition id="AlshaterAd" component={AlshaterAd} durationInFrames={DURATION} fps={30} width={1080} height={1920} />
    <Still id="SoftwareStory" component={SoftwareStory} width={1080} height={1920} />
    <Still id="SoftwarePost" component={SoftwarePost} width={1080} height={1350} />
  </>
);
