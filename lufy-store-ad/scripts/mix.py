"""Final audio mix for the LUFY STORE ad (55.0 s, 48 kHz stereo).

Builds two mixes with ffmpeg:
  output/mix_full.wav   — Saudi VO + music + SFX (+ fictional commentator)
  output/mix_no_vo.wav  — same, without the narrator VO (commentator kept: it is diegetic TV sound)
Then muxes them with the rendered picture into the deliverable MP4s.

Every cue below is placed in AD time (seconds) and documented next to the scene it belongs to.
"""
import os
import subprocess

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
A = os.path.join(ROOT, 'assets', 'audio')
SFX = os.path.join(A, 'sfx')
OUT = os.path.join(ROOT, 'output')
DUR = 55.0

VO = os.path.join(A, 'vo_take1.mp3')
# (vo_in, vo_out, ad_time) — line splits measured with silencedetect on vo_take1.mp3
VO_LINES = [
    (0.00, 1.14, 5.60),   # في عزّ الحماس…
    (1.49, 3.10, 6.80),   # وفجأة كل شي وقف؟!
    (3.65, 5.74, 8.45),   # لا تخلّي اختيار اشتراكك عشوائي!
    (6.21, 8.21, 10.70),  # عشان تختار اشتراكك على بيّنة…
    (8.49, 9.58, 12.80),  # ادخل لوفي ستور!
    (10.02, 12.59, 15.60),  # عندك اشتراكات هولك، بمدد مختلفة…
    (12.89, 13.98, 18.40),  # اختر اللي يناسبك.
    (14.32, 19.39, 24.70),  # وبرضه باقات القاضي… خيارات متعددة، وتفاصيل واضحة قبل الطلب.
    (19.62, 22.14, 33.30),  # وعندنا بعد منتجات رقمية إضافية،
    (22.37, 24.49, 35.95),  # تقدر تتعرف على شروطها من المتجر.
    (24.81, 25.66, 38.50),  # كل اللي عليك…
    (25.85, 30.18, 39.60),  # تدخل المتجر، تشوف الباقات، وتقارن التفاصيل قبل ما تختار.
    (30.49, 31.20, 46.30),  # تصفّح
    (31.46, 31.92, 47.40),  # قارن
    (32.13, 32.58, 48.30),  # اختر!
    (32.88, 33.61, 51.70),  # لوفي ستور…
    (33.86, 35.87, 52.50),  # ادخل الحين، واختر اشتراكك!
]

# (file, ad_time, gain_db, trim_in, trim_len)  — trim_len None = whole file
CUES = [
    # S1 opening — tension build, crowd, commentator, interruption
    (os.path.join(A, 'stadium_native.wav'), 0.0, -6, 0.0, 4.6),
    (os.path.join(SFX, 'heartbeat.wav'), 0.0, -4, 0.0, 4.6),
    (os.path.join(SFX, 'riser.wav'), 0.2, -9, 0.0, 4.4),
    (os.path.join(SFX, 'whoosh_1.wav'), 1.55, -8, 0.0, None),
    (os.path.join(SFX, 'whoosh_4.wav'), 3.05, -10, 0.0, None),
    (os.path.join(SFX, 'record_scratch.mp3'), 4.52, 0, 0.0, 0.48),
    # S2 hook
    (os.path.join(SFX, 'bass_impact.wav'), 5.60, 0, 0.0, None),
    (os.path.join(SFX, 'dark_drone.wav'), 5.70, -8, 0.0, 3.4),
    (os.path.join(SFX, 'shatter.wav'), 7.85, -2, 0.0, None),
    (os.path.join(SFX, 'whoosh_big.wav'), 8.15, -6, 0.0, None),
    # S3 enter store
    (os.path.join(SFX, 'whoosh_2.wav'), 8.95, -7, 0.0, None),
    (os.path.join(SFX, 'ui_click.wav'), 12.20, -6, 0.0, None),
    # S4 HULK cards
    (os.path.join(SFX, 'whoosh_3.wav'), 16.30, -9, 0.0, None),
    (os.path.join(SFX, 'soft_pop.wav'), 16.55, -6, 0.0, None),
    (os.path.join(SFX, 'soft_pop.wav'), 17.05, -6, 0.0, None),
    (os.path.join(SFX, 'soft_pop.wav'), 17.55, -6, 0.0, None),
    (os.path.join(SFX, 'whoosh_5.wav'), 18.95, -10, 0.0, None),
    (os.path.join(SFX, 'whoosh_6.wav'), 20.80, -10, 0.0, None),
    # S5 ALQadi (match cut flip, TV on, cards)
    (os.path.join(SFX, 'whoosh_big.wav'), 23.80, -6, 0.0, None),
    (os.path.join(SFX, 'ui_click.wav'), 24.40, -6, 0.0, None),
    (os.path.join(SFX, 'soft_pop.wav'), 24.75, -6, 0.0, None),
    (os.path.join(SFX, 'soft_pop.wav'), 25.35, -6, 0.0, None),
    (os.path.join(SFX, 'soft_pop.wav'), 25.95, -6, 0.0, None),
    (os.path.join(SFX, 'whoosh_1.wav'), 26.30, -10, 0.0, None),
    (os.path.join(SFX, 'whoosh_2.wav'), 27.80, -10, 0.0, None),
    (os.path.join(SFX, 'whoosh_3.wav'), 29.40, -8, 0.0, None),
    # S6 snap (whip pan)
    (os.path.join(SFX, 'whoosh_big.wav'), 32.75, -5, 0.0, None),
    # S7 real browsing — taps in the recordings + step chips + order-button callout
    (os.path.join(SFX, 'whoosh_4.wav'), 37.85, -8, 0.0, None),
    (os.path.join(SFX, 'ui_click.wav'), 40.10, -8, 0.0, None),
    (os.path.join(SFX, 'soft_pop.wav'), 39.53, -8, 0.0, None),
    (os.path.join(SFX, 'ui_click.wav'), 39.74, -8, 0.0, None),
    (os.path.join(SFX, 'soft_pop.wav'), 40.60, -8, 0.0, None),
    (os.path.join(SFX, 'soft_pop.wav'), 41.70, -8, 0.0, None),
    (os.path.join(SFX, 'ui_click.wav'), 42.78, -8, 0.0, None),
    (os.path.join(SFX, 'gold_pop.wav'), 44.53, -6, 0.0, None),
    # S8 montage — a whoosh per cut, punches on the three words
] + [
    (os.path.join(SFX, f'whoosh_{(k % 6) + 1}.wav'), 46.0 + k * 11 / 30 - 0.25, -9, 0.0, None) for k in range(8)
] + [
    (os.path.join(SFX, 'bass_impact.wav'), 46.30, -7, 0.0, 1.6),
    (os.path.join(SFX, 'bass_impact.wav'), 47.40, -7, 0.0, 1.6),
    (os.path.join(SFX, 'bass_impact.wav'), 48.30, -5, 0.0, 2.0),
    (os.path.join(SFX, 'whoosh_big.wav'), 48.85, -7, 0.0, None),
    # S9 logo reveal + CTA
    (os.path.join(SFX, 'logo_reveal.wav'), 50.60, -2, 0.0, None),
    (os.path.join(SFX, 'bass_impact_final.wav'), 51.60, -3, 0.0, None),
    (os.path.join(SFX, 'gold_pop.wav'), 52.73, -4, 0.0, None),
    (os.path.join(SFX, 'ui_click.wav'), 53.20, -9, 0.0, None),
]
COMMENTATOR = (os.path.join(A, 'commentator_1.mp3'), 1.00, -1)  # "والكرة الآن… فرصة خطيييرة…!" cut by the scratch at 4.6
MUSIC = os.path.join(A, 'music_a.mp3')


def run(cmd):
    print(' '.join(cmd)[:300], '...')
    subprocess.run(cmd, check=True)


def build(with_vo: bool, out_wav: str):
    inputs, chains, labels = [], [], []

    def add_input(path):
        inputs.extend(['-i', path])
        return len(inputs) // 2 - 1

    # music: intro 0–4.6 s, hard stop (interruption), back in at 9.0 s, tail to 55 s
    mi = add_input(MUSIC)
    chains.append(f'[{mi}:a]aformat=sample_rates=48000:channel_layouts=stereo,asplit=2[m1][m2]')
    chains.append('[m1]atrim=0:4.6,afade=t=in:d=0.4,afade=t=out:st=4.55:d=0.05,volume=-7dB[mA]')
    chains.append('[m2]atrim=9.0:55.0,asetpts=PTS-STARTPTS,afade=t=in:d=0.25,afade=t=out:st=45.4:d=0.6,volume=-5dB,adelay=9000|9000[mB]')
    chains.append('[mA][mB]amix=inputs=2:normalize=0[music]')

    fx = []
    for k, (path, at, gain, tin, tlen) in enumerate(CUES):
        i = add_input(path)
        trim = f'atrim={tin}:{tin + tlen},' if tlen else (f'atrim=start={tin},' if tin else '')
        ms = int(round(at * 1000))
        chains.append(f'[{i}:a]aformat=sample_rates=48000:channel_layouts=stereo,{trim}asetpts=PTS-STARTPTS,afade=t=out:st={max(0.0, (tlen or 99) - 0.08)}:d=0.08,volume={gain}dB,adelay={ms}|{ms}[fx{k}]')
        fx.append(f'[fx{k}]')
    ci = add_input(COMMENTATOR[0])
    ms = int(COMMENTATOR[1] * 1000)
    chains.append(f'[{ci}:a]aformat=sample_rates=48000:channel_layouts=stereo,atrim=0:{4.58 - COMMENTATOR[1]},afade=t=out:st={4.5 - COMMENTATOR[1]}:d=0.08,'
                  f'highpass=f=180,lowpass=f=7000,acompressor=threshold=-18dB:ratio=3,volume={COMMENTATOR[2]}dB,adelay={ms}|{ms}[comm]')
    fx.append('[comm]')
    chains.append(f'{"".join(fx)}amix=inputs={len(fx)}:normalize=0[sfx]')

    if with_vo:
        vo = []
        for k, (a, b, at) in enumerate(VO_LINES):
            i = add_input(VO)
            ms = int(round(at * 1000))
            chains.append(f'[{i}:a]aformat=sample_rates=48000:channel_layouts=stereo,atrim={a}:{b + 0.06},asetpts=PTS-STARTPTS,'
                          f'afade=t=in:d=0.015,afade=t=out:st={b - a}:d=0.06,adelay={ms}|{ms}[v{k}]')
            vo.append(f'[v{k}]')
        chains.append(f'{"".join(vo)}amix=inputs={len(vo)}:normalize=0,highpass=f=70,'
                      'equalizer=f=3200:t=q:w=1.2:g=2.5,acompressor=threshold=-20dB:ratio=3:attack=5:release=120:makeup=4dB,volume=2dB,asplit=2[vo][vokey]')
        # duck music under the narrator
        chains.append('[music][vokey]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=350:makeup=1[musicd]')
        chains.append('[musicd][sfx][vo]amix=inputs=3:normalize=0[pre]')
    else:
        chains.append('[music][sfx]amix=inputs=2:normalize=0[pre]')
    chains.append(f'[pre]apad=whole_dur={DUR},atrim=0:{DUR},alimiter=limit=0.89:attack=3:release=60,loudnorm=I=-14:TP=-1.0:LRA=11,aresample=48000[out]')
    run(['ffmpeg', '-y', '-loglevel', 'error', *inputs, '-filter_complex', ';'.join(chains), '-map', '[out]', '-ar', '48000', '-ac', '2', out_wav])


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    build(True, os.path.join(OUT, 'mix_full.wav'))
    build(False, os.path.join(OUT, 'mix_no_vo.wav'))
    print('mixes written')
