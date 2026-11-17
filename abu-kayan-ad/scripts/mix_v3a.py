"""Audio mix for Abu Kayan v3 · concept A v2 (60 s). Writes output/v3/mix_v3a_full.wav and mix_v3a_no_vo.wav.

Cue times follow remotion/src/V3A.tsx (NOTIF_AT, CHAT_CUTS, WIPE_AT, ABU_EVENTS). Music cuts dead at 15 s (the
"silence" beat) and comes back warm at 19 s. VO (RAED ALOTAIBI) is optional: if assets/audio/v3/vo_raed.mp3 exists,
place its lines with VO_LINES (measure splits with silencedetect first).
"""
import os
import subprocess
import wave

import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
A = os.path.join(ROOT, 'assets', 'audio')
A3 = os.path.join(A, 'v3')
SFX = os.path.abspath(os.path.join(ROOT, '..', 'lufy-store-ad', 'assets', 'audio', 'sfx'))
OUT = os.path.join(ROOT, 'output', 'v3')
DUR = 60.0
MUSIC = os.path.join(A, 'music2_a.mp3')
VO = os.path.join(A3, 'vo_raed_a.mp3')  # RAED ALOTAIBI, eleven_v4, take A (38.3 s)
SR = 48000

# (vo_in, vo_out, ad_time) — fill after generating the VO; empty = no VO track
VO_LINES: list[tuple[float, float, float]] = [
    (0.00, 2.62, 0.30),    # من أول ما قلت إنك تدوّر شقة في جدة…
    (2.91, 4.09, 2.95),    # جوالك ما سكت!
    (4.36, 5.53, 5.30),    # الكل يرسل عروض…
    (5.80, 6.83, 8.30),    # الكل مستعجل…
    (7.04, 8.27, 11.60),   # والكل عنده "لقطة".
    (8.55, 10.60, 15.45),  # بس… ولا واحد فيهم سألك:
    (10.99, 12.20, 17.40), # أنت… وش تبي؟
    (12.70, 13.61, 21.30), # إلا واحد.
    (14.02, 15.45, 24.30), # أبو كيان ما يبدأ بعرض…
    (15.88, 17.19, 26.40), # يبدأ بطلبك أنت.
    (17.52, 18.72, 28.70), # وش الحي اللي في بالك؟
    (19.04, 19.92, 30.70), # كم ميزانيتك؟
    (20.21, 21.57, 32.70), # ووش أهم شي عندك؟
    (21.85, 23.91, 36.20), # وبعدها يجيك العرض مفصّل:
    (24.22, 26.61, 40.60), # المدارس كم تبعد، الخدمات وين…
    (26.92, 30.34, 44.30), # والأوراق والسعر واضحة، قبل ما تطلع أي مشوار.
    (30.74, 32.23, 51.00), # الكل يبي يبيعك شقة…
    (32.54, 34.74, 52.65), # وأبو كيان يبيك تلقى بيتك.
    (35.06, 36.78, 56.40), # أرسل طلبك لأبو كيان الحين…
    (37.06, 38.12, 58.30), # وبتلاقي طلبك.
]


def synth():
    """Phone notification ping + vibration buzz + chat 'sent' tick, written once to assets/audio/v3."""
    os.makedirs(A3, exist_ok=True)

    def write(name, x):
        x = np.clip(x, -1, 1)
        st = (np.stack([x, x], 1) * 32767).astype(np.int16)
        with wave.open(os.path.join(A3, name), 'wb') as w:
            w.setnchannels(2), w.setsampwidth(2), w.setframerate(SR), w.writeframes(st.tobytes())

    t = np.arange(int(SR * 0.45)) / SR
    ping = np.zeros_like(t)
    for f0, st, g in [(1318.5, 0.0, 0.55), (1760.0, 0.075, 0.5)]:
        tt = np.clip(t - st, 0, None)
        env = (t >= st) * np.exp(-tt * 14) * np.minimum(1, tt * 400)
        ping += g * env * (np.sin(2 * np.pi * f0 * tt) + 0.25 * np.sin(2 * np.pi * 2 * f0 * tt))
    write('ping.wav', ping * 0.8)

    t = np.arange(int(SR * 0.32)) / SR
    env = np.minimum(1, t * 60) * np.minimum(1, (0.32 - t) * 30)
    buzz = env * np.tanh(3 * np.sin(2 * np.pi * 165 * t)) * (0.6 + 0.4 * np.sin(2 * np.pi * 28 * t))
    write('buzz.wav', buzz * 0.6)

    t = np.arange(int(SR * 0.16)) / SR
    f = 900 + 900 * np.exp(-t * 40)
    tick = np.exp(-t * 32) * np.minimum(1, t * 600) * np.sin(2 * np.pi * np.cumsum(f) / SR)
    write('sent.wav', tick * 0.6)


S = lambda n: os.path.join(SFX, n)
L = lambda n: os.path.join(A, n)
V = lambda n: os.path.join(A3, n)
fr = lambda n: n / 30.0

NOTIF_AT = [fr(8 + i * 11) for i in range(8)]
CUES = []
# 1 hook — pings + buzzes, counter pop
for i, t in enumerate(NOTIF_AT):
    CUES += [(V('ping.wav'), t, -9 - (i % 3), None), (V('buzz.wav'), t, -12, None)]
CUES += [(S('gold_pop.wav'), 2.9, -9, None), (S('whoosh_big.wav'), 4.75, -12, None)]
# 2 flood — whip between chats, pops for each incoming message
CUES += [(S(f'whoosh_{k}.wav'), 5.0 + 2 * i - 0.05, -14, None) for i, k in zip(range(1, 5), [1, 2, 3, 1])]
for i in range(6):
    CUES.append((V('ping.wav'), 5 + fr(4 + i * 8), -19, None))
for c, msgs in enumerate([[3, 12, 34], [3, 14, 36], [3, 16, 36], [3, 14, 32]], start=1):
    for m in msgs:
        CUES.append((V('ping.wav'), 5 + 2 * c + fr(m), -16, None))
CUES += [(V('buzz.wav'), 9.5, -15, None), (V('buzz.wav'), 13.3, -14, None), (S('riser.wav'), 12.6, -18, 2.4)]
# 3 freeze — scratch, heartbeat, impact on the question
CUES += [(S('record_scratch.mp3'), 14.95, -9, None), (S('bass_impact.wav'), 15.0, -12, 1.4),
         (S('heartbeat.wav'), 15.7, -10, 3.0), (S('bass_impact_final.wav'), 15 + fr(70), -8, 1.8)]
# 4 wipe — swipes, then the one chat glows
CUES += [(S('whoosh_big.wav'), 18.7, -12, None)]
CUES += [(S('whoosh_5.wav' if k % 2 else 'whoosh_6.wav'), 19 + fr(22 + 8 * k), -17, None) for k in range(7)]
CUES += [(S('logo_reveal.wav'), 19 + fr(84), -10, None), (S('gold_pop.wav'), 19 + fr(86), -12, None)]
# 5+6 Abu Kayan chat
ab = 24.0
CUES += [(V('ping.wav'), ab + fr(26), -10, None)]
CUES += [(S('soft_pop.wav'), ab + t, -11, None) for t in (4.6, 6.6, 8.6)]
CUES += [(V('sent.wav'), ab + t, -10, None) for t in (12.3, 12.9, 13.5)]
CUES += [(S('whoosh_6.wav'), ab + 15.2, -13, None), (S('gold_pop.wav'), ab + 15.5, -10, None)]
CUES += [(S('ui_click.wav'), ab + 16.6 + 0.95 * i, -13, None) for i in range(6)]
CUES += [(L('sfx_stamp_cut.wav'), ab + 16.6 + 0.95 * 4 + 0.1, -10, None)]  # deeds ✓
CUES += [(V('ping.wav'), ab + 23.2, -10, None)]
# 7 split + line
CUES += [(S('whoosh_big.wav'), 49.6, -11, None), (S('whoosh_3.wav'), 50.45, -15, None),
         (S('bass_impact.wav'), 52.65, -12, 1.4), (S('gold_pop.wav'), 52.95, -11, None)]
# 8 CTA
CUES += [(S('whoosh_big.wav'), 54.6, -11, None), (L('sfx_logo.mp3'), 56.25, -6, None), (S('logo_reveal.wav'), 56.3, -13, None),
         (S('ui_click.wav'), 56.7, -12, None), (S('gold_pop.wav'), 57.25, -11, None)]


def run(cmd):
    subprocess.run(cmd, check=True)


def build(with_vo, out_wav):
    inputs, chains, fx = [], [], []

    def add(path):
        inputs.extend(['-i', path])
        return len(inputs) // 2 - 1

    fmt = 'aformat=sample_rates=48000:channel_layouts=stereo'
    # music: busy part 0–15 s (filtered, phone-speaker-ish), hard cut, warm return at 19 s
    m1 = add(MUSIC)
    chains.append(f'[{m1}:a]{fmt},atrim=0:15,asetpts=PTS-STARTPTS,highpass=f=180,volume=-8dB,afade=t=in:d=0.3,afade=t=out:st=14.93:d=0.07[m1]')
    m2 = add(MUSIC)
    chains.append(f'[{m2}:a]{fmt},atrim=7:48,asetpts=PTS-STARTPTS,volume=-6dB,afade=t=in:d=1.2,afade=t=out:st=39.3:d=1.7,adelay=19000|19000[m2]')
    chains.append('[m1][m2]amix=inputs=2:normalize=0[music]')
    for k, (path, at, gain, tlen) in enumerate(CUES):
        i = add(path)
        trim = f'atrim=0:{tlen},afade=t=out:st={max(0, tlen - 0.15)}:d=0.15,' if tlen else ''
        ms = int(round(at * 1000))
        chains.append(f'[{i}:a]{fmt},{trim}asetpts=PTS-STARTPTS,volume={gain}dB,adelay={ms}|{ms}[f{k}]')
        fx.append(f'[f{k}]')
    chains.append(f'{"".join(fx)}amix=inputs={len(fx)}:normalize=0[sfx]')
    if with_vo and VO_LINES and os.path.exists(VO):
        vo = []
        for k, (a, b, at) in enumerate(VO_LINES):
            i = add(VO)
            ms = int(round(at * 1000))
            chains.append(f'[{i}:a]{fmt},atrim={a}:{b + 0.05},asetpts=PTS-STARTPTS,afade=t=in:d=0.012,afade=t=out:st={b - a}:d=0.05,adelay={ms}|{ms}[v{k}]')
            vo.append(f'[v{k}]')
        chains.append(f'{"".join(vo)}amix=inputs={len(vo)}:normalize=0,highpass=f=70,equalizer=f=3000:t=q:w=1.2:g=2.5,'
                      'acompressor=threshold=-20dB:ratio=3.5:attack=4:release=110:makeup=5dB,volume=2dB,asplit=2[vo][key]')
        chains.append('[music][key]sidechaincompress=threshold=0.03:ratio=8:attack=15:release=350:makeup=1[md]')
        chains.append('[md][sfx][vo]amix=inputs=3:normalize=0[pre]')
    else:
        chains.append('[music][sfx]amix=inputs=2:normalize=0[pre]')
    chains.append(f'[pre]apad=whole_dur={DUR},atrim=0:{DUR},alimiter=limit=0.89:attack=3:release=50,loudnorm=I=-14:TP=-1.0:LRA=11,aresample=48000[out]')
    run(['ffmpeg', '-y', '-loglevel', 'error', *inputs, '-filter_complex', ';'.join(chains), '-map', '[out]', '-ar', '48000', '-ac', '2', out_wav])


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    synth()
    build(True, os.path.join(OUT, 'mix_v3a_full.wav'))
    build(False, os.path.join(OUT, 'mix_v3a_no_vo.wav'))
    print('mixes written', 'with VO' if VO_LINES and os.path.exists(VO) else '(no VO yet)')
