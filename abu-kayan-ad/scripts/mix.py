"""Audio mix for the Abu Kayan ad (45.0 s). Writes output/mix_full.wav and output/mix_no_vo.wav.
VO line splits were measured with silencedetect on vo_a.mp3 and checked against the transcript.
"""
import os
import subprocess

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
A = os.path.join(ROOT, 'assets', 'audio')
SFX = os.path.abspath(os.path.join(ROOT, '..', 'lufy-store-ad', 'assets', 'audio', 'sfx'))  # shared procedural SFX
OUT = os.path.join(ROOT, 'output')
DUR = 45.0
VO = os.path.join(A, 'vo_a.mp3')
MUSIC = os.path.join(A, 'music_a.mp3')
MUSIC_OFFSET = 0.0

# (vo_in, vo_out, ad_time)
VO_LINES = [
    (0.00, 1.34, 0.15),    # تدوّر شقة من شهور…
    (1.77, 3.62, 1.55),    # وكل ما تروح تشوف، تنصدم؟
    (4.01, 7.79, 3.85),    # إعلانات كثيرة، صور غير الواقع، أسعار كل يوم بحال…
    (8.22, 9.75, 7.95),    # وأنت تلف من مكان لمكان.
    (10.19, 11.53, 10.20), # إحنا ما نرمي عليك عروض…
    (11.95, 13.01, 11.95), # إحنا نختار لك.
    (13.29, 15.92, 15.15), # شقق مختارة بعناية، تستاهل وقتك.
    (16.21, 19.88, 17.95), # نعرض لك اللي يناسب ميزانيتك واحتياجك، بدون مشاوير زايدة.
    (20.17, 23.49, 21.85), # كل عقار موثّق، وكل تفصيل واضح قبل لا توقّع.
    (23.73, 27.84, 25.45), # سعر عادل، وتعامل بشفافية من أول زيارة لين الاستلام.
    (28.22, 31.82, 30.50), # لأن البيت قرار عمر… ويستاهل أحد يدلّك عليه صح.
    (32.07, 35.01, 38.30), # تدوّر عقارك؟ قل لنا وش تبي… ونجيبه لك.
    (35.31, 37.26, 41.55), # أبو كيان للتسويق العقاري.
]

S = lambda n: os.path.join(SFX, n)
L = lambda n: os.path.join(A, n)
# (file, ad_time, gain_db, trim_len or None)
CUES = [
    # 1. hook
    (S('whoosh_big.wav'), 0.02, -8, None),
    (S('soft_pop.wav'), 1.53, -6, None),
    (L('sfx_glitch.mp3'), 3.05, -6, 0.9),
    # 2. struggle
    (S('bass_impact.wav'), 3.60, -9, 1.4),
    (L('sfx_glitch.mp3'), 5.05, -10, 0.35),
    (S('ui_click.wav'), 5.45, -5, None),
    (L('sfx_glitch.mp3'), 6.45, -10, 0.35),
    (S('soft_pop.wav'), 7.95, -6, None),
    (S('soft_pop.wav'), 8.40, -8, None),
    (S('soft_pop.wav'), 8.85, -8, None),
    (S('whoosh_5.wav'), 9.40, -6, None),
    (S('bass_impact.wav'), 9.92, -6, 1.6),
    # 3. the shift
    (L('sfx_chime.mp3'), 10.45, -7, None),
    (S('riser.wav'), 11.90, -14, 1.5),
    (L('sfx_chime.mp3'), 13.25, -4, None),
    (S('logo_reveal.wav'), 13.35, -3, None),
    # 4. why us (whip pans + checks)
    (S('ui_click.wav'), 15.25, -8, None),
    (S('whoosh_2.wav'), 17.62, -7, None), (S('ui_click.wav'), 18.00, -8, None),
    (S('soft_pop.wav'), 18.85, -8, None), (S('soft_pop.wav'), 19.45, -8, None),
    (S('gold_pop.wav'), 20.90, -9, None),
    (S('whoosh_3.wav'), 21.52, -7, None), (S('ui_click.wav'), 21.90, -8, None),
    (S('bass_impact.wav'), 22.78, -8, 1.0),
    (S('whoosh_4.wav'), 25.12, -7, None), (S('ui_click.wav'), 25.50, -8, None),
    # 5. the moment
    (L('sfx_chime.mp3'), 31.15, -8, None),
    (L('sfx_chime.mp3'), 33.55, -4, None),
    (S('soft_pop.wav'), 34.40, -8, None), (S('soft_pop.wav'), 34.80, -8, None), (S('soft_pop.wav'), 35.20, -8, None),
    (S('whoosh_big.wav'), 37.45, -9, None),
    # 6. CTA
    (S('logo_reveal.wav'), 38.02, -6, None),
    (S('ui_click.wav'), 39.20, -8, None), (S('ui_click.wav'), 39.40, -8, None),
    (S('gold_pop.wav'), 40.42, -4, None),
    (L('sfx_chime.mp3'), 43.40, -7, None),
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
                  f'volume=-7dB,afade=t=out:st={DUR - 1.2}:d=1.2[music]')
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
