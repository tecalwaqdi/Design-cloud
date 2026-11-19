// Loads the store's headline font (Ping AR + LT) from public/fonts when the files are present.
// fonts.json lists the files: [{ "file": "PingARLT-Heavy.otf", "weight": 800 }, ...]
import { continueRender, delayRender, staticFile } from 'remotion';
import manifest from './fonts.json';

const list = manifest as { file: string; weight: number }[];
if (typeof document !== 'undefined' && list.length) {
  const handle = delayRender('Loading Ping AR + LT');
  Promise.all(
    list.map((m) =>
      new FontFace('PingARLT', `url(${staticFile(`fonts/${m.file}`)})`, { weight: String(m.weight) })
        .load()
        .then((f) => document.fonts.add(f)),
    ),
  )
    .then(() => continueRender(handle))
    .catch((e) => {
      console.error('font load failed', e);
      continueRender(handle);
    });
}
export const FONT_READY = list.length > 0;
