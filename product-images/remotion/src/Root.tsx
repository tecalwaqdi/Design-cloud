import React from 'react';
import { Composition } from 'remotion';
import { TechProduct } from './TechProduct';

export const Root: React.FC = () => (
  <Composition id="TechProduct" component={TechProduct} durationInFrames={1} fps={30} width={1080} height={1080} defaultProps={{ price: '3000' }} />
);
