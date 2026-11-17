"""Audio mix for the Abu Kayan ad v2 (45.0 s, navy/copper brand edit). Writes output/mix_full.wav and output/mix_no_vo.wav.
VO line splits were measured with silencedetect on vo_a.mp3 and checked against the transcript.
"""
import os
import subprocess

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
A = os.path.join(ROOT, 'assets', 'audio')
SFX = os.path.abspath(os.path.join(ROOT, '..', 'lufy-store-ad', 'assets', 'audio', 'sfx'))  # shared procedural SFX
OUT = os.path.join(ROOT, 'output')
DUR = 45.0
VO = os.path.join(A, 'vo2_a.mp3')
MUSIC = os.path.join(A, 'music2_a.mp3')
MUSIC_OFFSET = 0.0

# (vo_in, vo_out, ad_time) — splits measured with silencedetect on vo2_a.mp3, checked against the transcript
VO_LINES = [
    (0.00, 1.07, 0.20),    # كم شقة زرت…
    (1.32, 3.16, 1.50),    # وما حسّيت إن وحدة منها بيتك؟
    (3.48, 7.60, 4.00),    # صور مفلترة، أسعار ما لها سقف، ومواعيد تاكل يومك…
    (7.92, 9.92, 8.50),    # والنتيجة؟ تعب بلا فايدة.
    (10.30, 13.56, 11.60), # في أبو كيان… نسمعك أول، وبعدين ندوّر لك.
    (13.79, 17.41, 16.20), # ننقّي لك الشقق اللي تستاهل زيارتك، مو أي إعلان وبس.
    (17.62, 20.22, 20.10), # على قد ميزانيتك، وفي الحي اللي يناسبك.
    (20.45, 23.64, 23.20), # أوراق نظامية ومراجعة كاملة… قبل ما توقّع.
    (23.88, 26.66, 26.80), # وسعر واضح من البداية، بدون مفاجآت.
    (26.92, 30.22, 30.80), # لأن المفتاح اللي بتستلمه… بداية حكاية عيلتك.
    (30.48, 32.57, 38.00), # قل لنا وش تدوّر… والباقي علينا.
    (32.90, 35.20, 40.50), # أبو كيان للخدمات العقارية.
]

S = lambda n: os.path.join(SFX, n)
L = lambda n: os.path.join(A, n)
# (file, ad_time, gain_db, trim_len or None)
CUES = [
    # 1. hook — arch rises, photos flick past
    (S('whoosh_big.wav'), 0.05, -12, None),
    *[(S('ui_click.wav'), 0.27 + k * 0.1667, -20 + (k % 2) * -2, None) for k in range(0, 18, 2)],
    # arch wipe into pain
    (S('whoosh_4.wav'), 3.62, -10, None),
    (S('bass_impact.wav'), 4.00, -14, 1.2),
    # 2. pain — copper strikes
    (S('whoosh_1.wav'), 4.80, -16, None),
    (S('whoosh_2.wav'), 5.80, -16, None),
    (S('whoosh_3.wav'), 7.13, -16, None),
    (S('bass_impact.wav'), 9.47, -11, 1.4),
    # 3. turn — doorway wipe, logo build
    (S('whoosh_big.wav'), 10.60, -10, None),
    (S('riser.wav'), 10.80, -18, 1.2),
    (L('sfx_logo.mp3'), 12.40, -5, None),
    (S('logo_reveal.wav'), 12.45, -12, None),
    (S('soft_pop.wav'), 13.60, -14, None),
    # 4. pillars — doorway wipe + copper sweeps
    (S('whoosh_big.wav'), 15.60, -11, None),
    (S('whoosh_5.wav'), 19.85, -12, None),
    (S('soft_pop.wav'), 20.83, -10, None),     # map pin lands
    (S('whoosh_6.wav'), 22.95, -12, None),
    (L('sfx_stamp_cut.wav'), 24.08, -3, None),      # review seal
    (S('whoosh_5.wav'), 26.55, -12, None),
    (S('soft_pop.wav'), 27.40, -12, None),
    # 5. moment — keys
    (S('whoosh_big.wav'), 29.60, -11, None),
    (L('sfx_keys.mp3'), 31.25, -6, None),
    (S('gold_pop.wav'), 31.35, -14, None),
    (S('gold_pop.wav'), 33.95, -16, None),
    # 6. CTA
    (S('whoosh_big.wav'), 37.10, -11, None),
    (L('sfx_logo.mp3'), 40.55, -6, None),
    (S('ui_click.wav'), 40.85, -12, None),
    (S('ui_click.wav'), 41.10, -12, None),
    (S('gold_pop.wav'), 41.65, -10, None),
]


def run(cmd):
    subprocess.run(cmd, check=True)


def build(with_vo, out_wav):
    inputs, chains, fx = [], [], []

    def add(path):
        inputs.extend(['-i', path])
        return len(inputs) // 2 - 1

    mi = add(MUSIC)
    chains.append(f'[{mi}:a]aformat=sample_rates=48000:channel_layouts=stereo,atrim={MUSIC_OFFSET}:{MUSIC_OFFSET + DUR},asetpts=PTS-STARTPTS,'
                  f'volume=-6dB,afade=t=out:st={DUR - 1.5}:d=1.5[music]')
    for k, (path, at, gain, tlen) in enumerate(CUES):
        i = add(path)
        trim = f'atrim=0:{tlen},afade=t=out:st={max(0, tlen - 0.08)}:d=0.08,' if tlen else ''
        ms = int(round(at * 1000))
        chains.append(f'[{i}:a]aformat=sample_rates=48000:channel_layouts=stereo,{trim}asetpts=PTS-STARTPTS,volume={gain}dB,adelay={ms}|{ms}[f{k}]')
        fx.append(f'[f{k}]')
    chains.append(f'{"".join(fx)}amix=inputs={len(fx)}:normalize=0[sfx]')
    if with_vo:
        vo = []
        for k, (a, b, at) in enumerate(VO_LINES):
            i = add(VO)
            ms = int(round(at * 1000))
            chains.append(f'[{i}:a]aformat=sample_rates=48000:channel_layouts=stereo,atrim={a}:{b + 0.05},asetpts=PTS-STARTPTS,'
                          f'afade=t=in:d=0.012,afade=t=out:st={b - a}:d=0.05,adelay={ms}|{ms}[v{k}]')
            vo.append(f'[v{k}]')
        chains.append(f'{"".join(vo)}amix=inputs={len(vo)}:normalize=0,highpass=f=70,equalizer=f=3000:t=q:w=1.2:g=2.5,'
                      'acompressor=threshold=-20dB:ratio=3.5:attack=4:release=110:makeup=5dB,volume=2dB,asplit=2[vo][key]')
        chains.append('[music][key]sidechaincompress=threshold=0.03:ratio=8:attack=15:release=350:makeup=1[md]')
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
