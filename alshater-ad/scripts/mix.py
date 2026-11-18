"""Audio mix for the EL-SHATER ad (49.5 s). Writes output/mix_full.wav and output/mix_no_vo.wav.
VO: take A (ElevenLabs, RAED ALOTAIBI, eleven_v4), split in two so a beat of silence lands before «لا…».
Music: music_a, re-edited on its 2-bar grid (120 BPM, downbeats at 16.31 + 2.0025k s) so the drop hits on «الشاطر!».
"""
import os
import subprocess

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
A = os.path.join(ROOT, 'assets', 'audio')
OUT = os.path.join(ROOT, 'output')
DUR = 49.5
VO = os.path.join(A, 'vo_a.mp3')
MUSIC = os.path.join(A, 'music_a.mp3')

# (vo_in, vo_out, ad_time)
VO_PARTS = [(0.0, 6.45, 0.30), (6.45, 42.40, 7.30)]
# (music_in, music_out, ad_time): drop 16.31 → ad 8.69; jump back 4 bars at a downbeat (32.33 → 24.32)
MUSIC_PARTS = [(7.62, 32.33, 0.0), (24.32, 50.0, 24.71)]

S = lambda n: os.path.join(A, 'sfx', n)
L = lambda n: os.path.join(A, n)

# card / service cue times (ad seconds) — mirror remotion/src/data.ts
cards = [0.38, 1.42, 2.38, 3.26]
svcs = [15.33, 16.45, 17.49, 18.77, 20.85, 22.61, 24.53, 26.77, 27.89, 29.25]
cuts = [9.5, 14.65, 30.5, 36.1, 39.4]

# (file, ad_time, gain_db, trim_len or None, trim_start)
CUES = [
    (L('sfx_clock.mp3'), 0.0, -11, 6.9, 0.42),
]
for i, t in enumerate(cards):
    CUES += [(S(f'whoosh_{i + 1}.wav'), t - 0.12, -13, None, 0), (L('sfx_stamp.mp3'), t + 0.233 - 0.196, -2, 0.6, 0), (S('bass_impact.wav'), t + 0.233, -14, 0.8, 0)]
CUES += [
    (S('whoosh_big.wav'), 4.45, -10, None, 0),
    *[(S('soft_pop.wav'), 4.6 + k * 0.3, -9, None, 0) for k in range(4)],
    (S('bass_impact.wav'), 5.42, -9, 1.2, 0),
    (S('riser.wav'), 5.7, -15, 1.55, 0),
    # «لا…» freeze
    (S('record_scratch.mp3'), 7.28, -5, 0.45, 0),
    (S('bass_impact.wav'), 7.49, -8, 1.2, 0),
    # «الشاطر!» hit
    (S('whoosh_big.wav'), 8.69 - 0.55, -6, None, 0),
    (S('bass_impact_final.wav'), 8.69, -1, None, 0),
    (L('sfx_paper.mp3'), 8.69 - 0.90, -3, None, 0),
    (S('logo_reveal.wav'), 8.69 - 0.37, -6, None, 0),
    # brand
    (S('ui_click.wav'), 9.62, -10, None, 0),
    (S('whoosh_2.wav'), 11.35, -9, None, 0), (S('gold_pop.wav'), 11.75, -6, None, 0),
    (S('whoosh_3.wav'), 12.40, -9, None, 0), (S('gold_pop.wav'), 13.62, -4, None, 0),
    # services: header + each card + its check stamp
    (S('soft_pop.wav'), 14.76, -6, None, 0),
]
for t in svcs:
    CUES += [(S('whoosh_4.wav'), t - 0.2, -13, None, 0), (L('sfx_stamp.mp3'), t + 0.38 - 0.196, -5, 0.6, 0), (S('soft_pop.wav'), t + 0.40, -10, None, 0)]
CUES += [(S('whoosh_5.wav'), t, -11, None, 0) for t in (18.65, 22.50, 26.65)]
CUES += [
    # 40+ government bodies
    (S('bass_impact.wav'), 30.53, -6, 1.6, 0),
    *[(S('ui_click.wav'), 32.61 + k * 0.17, -14, None, 0) for k in range(6)],
    (S('gold_pop.wav'), 32.61, -7, None, 0),
    *[(S('bass_impact.wav'), t, -8, 1.0, 0) for t in (33.81, 34.61, 35.41)],
    *[(S('whoosh_3.wav'), t - 0.18, -11, None, 0) for t in (33.81, 34.61, 35.41)],
    # slogan
    (S('gold_pop.wav'), 37.33, -9, None, 0),
    (S('gold_pop.wav'), 38.21, -4, None, 0), (S('bass_impact.wav'), 38.21, -10, 1.4, 0),
    # CTA + end card
    (S('gold_pop.wav'), 39.52, -3, None, 0), (S('bass_impact.wav'), 39.52, -6, 1.4, 0),
    (S('logo_reveal.wav'), 40.53 - 0.37 - 0.3, -3, None, 0),
    (S('soft_pop.wav'), 42.37, -6, None, 0),
    (S('whoosh_2.wav'), 43.1, -8, None, 0),
    *[(S('ui_click.wav'), 43.5 + k * 0.17, -12, None, 0) for k in range(5)],
    (S('bass_impact_final.wav'), 48.72, -9, None, 0),
]
for c in cuts:
    CUES.append((S('whoosh_big.wav'), c - 0.45, -8, None, 0))


def run(cmd):
    subprocess.run(cmd, check=True)


def build(with_vo, out_wav):
    inputs, chains = [], []

    def add(path):
        inputs.extend(['-i', path])
        return len(inputs) // 2 - 1

    mus = []
    for k, (a, b, at) in enumerate(MUSIC_PARTS):
        i = add(MUSIC)
        ms = int(round(at * 1000))
        chains.append(f'[{i}:a]aformat=sample_rates=48000:channel_layouts=stereo,atrim={a}:{b + 0.03},asetpts=PTS-STARTPTS,'
                      f'afade=t=in:d={0.005 if k == 0 else 0.03},afade=t=out:st={b - a - 0.0}:d=0.03,adelay={ms}|{ms}[m{k}]')
        mus.append(f'[m{k}]')
    chains.append(f'{"".join(mus)}amix=inputs={len(mus)}:normalize=0,volume=-5dB,afade=t=out:st={DUR - 0.6}:d=0.6[music]')
    fx = []
    for k, (path, at, gain, tlen, tstart) in enumerate(CUES):
        i = add(path)
        trim = f'atrim={tstart}:{tstart + tlen},asetpts=PTS-STARTPTS,afade=t=out:st={max(0, tlen - 0.15)}:d=0.15,' if tlen else (f'atrim=start={tstart},' if tstart else '')
        ms = max(0, int(round(at * 1000)))
        chains.append(f'[{i}:a]aformat=sample_rates=48000:channel_layouts=stereo,{trim}asetpts=PTS-STARTPTS,volume={gain}dB,adelay={ms}|{ms}[f{k}]')
        fx.append(f'[f{k}]')
    chains.append(f'{"".join(fx)}amix=inputs={len(fx)}:normalize=0[sfx]')
    if with_vo:
        vo = []
        for k, (a, b, at) in enumerate(VO_PARTS):
            i = add(VO)
            ms = int(round(at * 1000))
            chains.append(f'[{i}:a]aformat=sample_rates=48000:channel_layouts=stereo,atrim={a}:{b},asetpts=PTS-STARTPTS,'
                          f'afade=t=in:d=0.01,afade=t=out:st={b - a - 0.04}:d=0.04,adelay={ms}|{ms}[v{k}]')
            vo.append(f'[v{k}]')
        chains.append(f'{"".join(vo)}amix=inputs={len(vo)}:normalize=0,highpass=f=70,equalizer=f=3000:t=q:w=1.2:g=2.5,'
                      'acompressor=threshold=-20dB:ratio=3.5:attack=4:release=110:makeup=5dB,volume=2dB,asplit=2[vo][key]')
        chains.append('[music][key]sidechaincompress=threshold=0.03:ratio=8:attack=15:release=320:makeup=1[md]')
        chains.append('[md][sfx][vo]amix=inputs=3:normalize=0[pre]')
    else:
        chains.append('[music][sfx]amix=inputs=2:normalize=0[pre]')
    chains.append(f'[pre]apad=whole_dur={DUR},atrim=0:{DUR},alimiter=limit=0.89:attack=3:release=50,loudnorm=I=-14:TP=-1.0:LRA=9,aresample=48000[out]')
    run(['ffmpeg', '-y', '-loglevel', 'error', *inputs, '-filter_complex', ';'.join(chains), '-map', '[out]', '-ar', '48000', '-ac', '2', out_wav])


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    build(True, os.path.join(OUT, 'mix_full.wav'))
    build(False, os.path.join(OUT, 'mix_no_vo.wav'))
    print('mixes written')
