"""Audio mix for the weekend ad (18.0 s). Writes output/mix_full.wav and output/mix_no_vo.wav."""
import os
import subprocess

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
A = os.path.join(ROOT, 'assets', 'audio')
SFX = os.path.abspath(os.path.join(ROOT, '..', 'lufy-store-ad', 'assets', 'audio', 'sfx'))
OUT = os.path.join(ROOT, 'output')
DUR = 18.0
VO = os.path.join(A, 'vo_a.mp3')
MUSIC = os.path.join(A, 'music_a.mp3')
WAKE = 3.5  # music opens up here

# (vo_in, vo_out, ad_time) — measured with silencedetect on vo_a.mp3
VO_LINES = [
    (0.00, 2.80, 0.30, 'vo_open_a.mp3'),  # ويكند… وبدون اشتراك؟! (clean re-take, no yawn)
    (4.05, 7.82, 3.55),    # القاضي فور كي… ست أشهر بتسعة وستين ريال بس!
    (8.09, 12.06, 9.05),   # وزيادة عليها… كود لوفي عشرة، خصم عشرة بالمية!
    (12.34, 15.73, 14.35), # التفعيل سريع، ودعم على الواتساب… لوفي ستور!
]
S = lambda n: os.path.join(SFX, n)
CUES = [
    (S('whoosh_big.wav'), 3.30, -6, None), (S('bass_impact.wav'), 3.50, -6, 1.6),  # wake-up
    (S('ui_click.wav'), 5.10, -7, None), (S('ui_click.wav'), 6.12, -7, None),        # taps in the real recording
    (S('gold_pop.wav'), 6.33, -4, None), (S('bass_impact.wav'), 6.33, -9, 1.2),      # 69 SAR slam
    (S('ui_click.wav'), 8.91, -6, None),                                               # add to cart
    (S('whoosh_3.wav'), 8.85, -9, None), (S('soft_pop.wav'), 9.20, -6, None),          # coupon card in
] + [(S('ui_click.wav'), 9.73 + k * 4 / 30, -10, None) for k in range(6)] + [          # typing L-U-F-Y-1-0
    (S('ui_click.wav'), 10.53, -5, None),                                              # apply
    (S('gold_pop.wav'), 10.87, -3, None),                                              # -10%
    (S('whoosh_big.wav'), 13.85, -5, None), (S('logo_reveal.wav'), 13.40, -3, None),   # dive -> end card
    (S('gold_pop.wav'), 15.40, -4, None), (S('ui_click.wav'), 15.93, -9, None),
]


def build(with_vo, out_wav):
    inputs, ch, fx = [], [], []

    def add(p):
        inputs.extend(['-i', p])
        return len(inputs) // 2 - 1

    m = add(MUSIC)
    ch.append(f'[{m}:a]aformat=sample_rates=48000:channel_layouts=stereo,atrim=0:{DUR},asetpts=PTS-STARTPTS,asplit=2[ma][mb]')
    ch.append(f'[ma]atrim=0:{WAKE},volume=-13dB,afade=t=in:d=0.4,afade=t=out:st={WAKE - 0.05}:d=0.05[m1]')  # clean, low intro
    ch.append(f'[mb]atrim={WAKE}:{DUR},asetpts=PTS-STARTPTS,volume=-4dB,afade=t=out:st={DUR - WAKE - 0.8}:d=0.8,adelay={int(WAKE * 1000)}|{int(WAKE * 1000)}[m2]')
    ch.append('[m1][m2]amix=inputs=2:normalize=0[music]')
    for k, (p, at, g, tl) in enumerate(CUES):
        i = add(p)
        trim = f'atrim=0:{tl},afade=t=out:st={tl - 0.08}:d=0.08,' if tl else ''
        ms = int(round(at * 1000))
        ch.append(f'[{i}:a]aformat=sample_rates=48000:channel_layouts=stereo,{trim}asetpts=PTS-STARTPTS,volume={g}dB,adelay={ms}|{ms}[f{k}]')
        fx.append(f'[f{k}]')
    ch.append(f'{"".join(fx)}amix=inputs={len(fx)}:normalize=0[sfx]')
    if True:  # same chain for both mixes; the no-VO mix mutes the narrator (so music/SFX are identical)
        vo = []
        for k, line in enumerate(VO_LINES):
            a, b, at = line[:3]
            i = add(os.path.join(A, line[3]) if len(line) > 3 else VO)
            ms = int(round(at * 1000))
            ch.append(f'[{i}:a]aformat=sample_rates=48000:channel_layouts=stereo,atrim={a}:{b + 0.05},asetpts=PTS-STARTPTS,'
                      f'afade=t=in:d=0.012,afade=t=out:st={b - a}:d=0.05,volume={1 if with_vo else 0},adelay={ms}|{ms}[v{k}]')
            vo.append(f'[v{k}]')
        ch.append(f'{"".join(vo)}amix=inputs={len(vo)}:normalize=0,highpass=f=70,equalizer=f=3000:t=q:w=1.2:g=3,'
                  'acompressor=threshold=-20dB:ratio=3.5:attack=4:release=110:makeup=5dB,volume=2dB,asplit=2[vo][key]')
        ch.append('[music][key]sidechaincompress=threshold=0.03:ratio=8:attack=15:release=300:makeup=1[md]')
        ch.append('[md][sfx][vo]amix=inputs=3:normalize=0[pre]')
    else:
        ch.append('[music][sfx]amix=inputs=2:normalize=0[pre]')
    ch.append(f'[pre]apad=whole_dur={DUR},atrim=0:{DUR},alimiter=limit=0.89:attack=3:release=50,loudnorm=I=-14:TP=-1.0:LRA=9,aresample=48000[out]')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', *inputs, '-filter_complex', ';'.join(ch), '-map', '[out]', '-ar', '48000', '-ac', '2', out_wav], check=True)


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    build(True, os.path.join(OUT, 'mix_full.wav'))
    build(False, os.path.join(OUT, 'mix_no_vo.wav'))
    print('mixes written')
