"""Audio mix for the HULK ad (30.0 s). Writes output/mix_full.wav and output/mix_no_vo.wav.
VO line splits were measured with silencedetect on vo_a.mp3 and checked against the transcript.
"""
import os
import subprocess

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
A = os.path.join(ROOT, 'assets', 'audio')
SFX = os.path.abspath(os.path.join(ROOT, '..', 'lufy-store-ad', 'assets', 'audio', 'sfx'))  # shared procedural SFX
OUT = os.path.join(ROOT, 'output')
DUR = 30.0
VO = os.path.join(A, 'vo_a.mp3')
MUSIC = os.path.join(A, 'music_b.mp3')
MUSIC_OFFSET = 1.25  # music's own drop lands on the punch at 6.75 s

# (vo_in, vo_out, ad_time)
VO_LINES = [
    (0.00, 0.605, 0.10),    # وقّف!
    (1.146, 4.373, 0.95),   # كم مرة قلّبت الليلة؟ مسلسل؟ فيلم؟ مباراة؟
    (4.637, 5.25, 4.40),    # وبالأخير…
    (5.57, 6.22, 5.15),     # ولا شي!
    (6.57, 8.38, 6.05),     # خلاص… حوّلها هولك!
    (8.75, 10.41, 8.05),    # اشتراك هولك من لوفي ستور…
    (10.71, 13.38, 9.90),   # ثلاث أشهر، ست أشهر، أو سنة كاملة.
    (13.67, 16.99, 12.80),  # والسنة كاملة… بمية وستة وتسعين ريال بس!
    (17.22, 19.39, 16.30),  # يعني أقل من سبعطعش ريال بالشهر!
    (19.67, 24.43, 18.65),  # ودعم مباشر على الواتساب… ونتواصل معك بعد الطلب بكل تفاصيل التفعيل.
    (24.76, 25.75, 23.65),  # لا تفكّر كثير…
    (25.96, 27.86, 24.80),  # اطلب هولك الحين من لوفي ستور!
]

S = lambda n: os.path.join(SFX, n)
L = lambda n: os.path.join(A, n)
# (file, ad_time, gain_db, trim_len or None)
CUES = [
    # hook: «وقّف!» + screen crack
    (S('bass_impact.wav'), 0.06, 0, None),
    (S('shatter.wav'), 0.08, -9, 1.2),
    # channel surfing
    (L('sfx_channels.mp3'), 1.00, -8, None),
    (L('sfx_channels.mp3'), 1.95, -9, None),
    (L('sfx_channels.mp3'), 2.90, -10, None),
    (L('sfx_channels.mp3'), 3.85, -11, None),
    (S('soft_pop.wav'), 2.36, -4, None),
    (S('soft_pop.wav'), 3.12, -4, None),
    (S('soft_pop.wav'), 3.63, -4, None),
    # freeze «ولا شي!»
    (os.path.abspath(os.path.join(ROOT, '..', 'lufy-store-ad', 'assets', 'audio', 'sfx', 'record_scratch.mp3')), 5.08, -3, 0.45),
    # wind-up + HULK SMASH on «حوّلها هولك»
    (L('sfx_powerup.mp3'), 5.20, -5, None),
    (L('sfx_punch.mp3'), 6.72, 0, None),
    (S('bass_impact_final.wav'), 6.72, -2, None),
    (S('shatter.wav'), 6.74, -4, None),
    (S('ui_click.wav'), 7.00, -4, None),          # HULK MODE switch
    (S('whoosh_big.wav'), 7.85, -6, None),        # lockup
    # three plans slam in with the voice
    (S('bass_impact.wav'), 9.88, -9, 1.4), (S('whoosh_2.wav'), 9.70, -9, None),
    (S('bass_impact.wav'), 10.78, -9, 1.4), (S('whoosh_3.wav'), 10.60, -9, None),
    (S('bass_impact.wav'), 11.62, -7, 1.6), (S('whoosh_5.wav'), 11.44, -9, None),
    # the year + 196 slam
    (S('whoosh_big.wav'), 12.55, -8, None),
    (S('riser.wav'), 13.70, -14, 2.1),
    (S('gold_pop.wav'), 15.80, -3, None), (S('bass_impact.wav'), 15.80, -7, 1.6),
    # the math
    (S('whoosh_4.wav'), 16.15, -8, None),
    (S('ui_click.wav'), 17.05, -7, None),
    (S('gold_pop.wav'), 17.60, -4, None), (S('bass_impact.wav'), 17.60, -6, 1.8),
    # trust
    (S('whoosh_6.wav'), 18.40, -8, None),
    (S('soft_pop.wav'), 18.77, -6, None),
    (S('soft_pop.wav'), 21.33, -6, None),
    # push + CTA punch + end card
    (S('bass_impact.wav'), 23.66, -4, 1.8),
    (S('whoosh_big.wav'), 24.65, -7, None),
    (L('sfx_punch.mp3'), 25.40, -1, None),
    (S('gold_pop.wav'), 25.42, -3, None),
    (S('logo_reveal.wav'), 25.80, -2, None),
    (S('ui_click.wav'), 27.70, -9, None),
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
                  f'volume=-6dB,afade=t=out:st={DUR - 0.7}:d=0.7[music]')
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
        chains.append(f'{"".join(vo)}amix=inputs={len(vo)}:normalize=0,highpass=f=70,equalizer=f=3000:t=q:w=1.2:g=3,'
                      'acompressor=threshold=-20dB:ratio=3.5:attack=4:release=110:makeup=5dB,volume=2dB,asplit=2[vo][key]')
        chains.append('[music][key]sidechaincompress=threshold=0.03:ratio=9:attack=15:release=300:makeup=1[md]')
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
