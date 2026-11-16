"""Synthesize the ad's sound-design elements (48 kHz stereo WAV).

All sounds are generated procedurally here (no third-party samples), so they are
fully owned/licence-free. Output: assets/audio/sfx/*.wav
"""
import os
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 48000
OUT = os.path.join(os.path.dirname(__file__), '..', 'assets', 'audio', 'sfx')
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)


def t_axis(d):
    return np.arange(int(SR * d)) / SR


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], btype='band', fs=SR, output='sos'), x)


def lp(x, f, order=2):
    return sosfilt(butter(order, f, btype='low', fs=SR, output='sos'), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, btype='high', fs=SR, output='sos'), x)


def env_adsr(n, a, r, curve=3.0):
    e = np.ones(n)
    na = max(1, int(a * SR))
    e[:na] = np.linspace(0, 1, na) ** 1.5
    nr = int(r * SR)
    if nr > 0:
        e[-nr:] *= np.linspace(1, 0, nr) ** curve
    return e


def reverb(x, decay=1.8, mix=0.3, seed=1):
    """Cheap stereo convolution reverb with exponentially-decaying noise IR."""
    r = np.random.default_rng(seed)
    n = int(decay * SR)
    tt = np.arange(n) / SR
    irs = []
    for ch in range(2):
        ir = r.standard_normal(n) * np.exp(-tt * 6.9 / decay)
        ir = lp(ir, 7000)
        ir[0] = 0
        irs.append(ir / np.sqrt(np.sum(ir ** 2)))
    mono = x if x.ndim == 1 else x.mean(axis=1)
    wet = np.stack([np.convolve(mono, ir)[: len(mono) + n] for ir in irs], axis=1)
    dry = np.zeros_like(wet)
    dry[: len(mono)] = np.stack([mono, mono], axis=1) if x.ndim == 1 else x
    return dry * (1 - mix) + wet * mix


def stereo(x, width=0.0):
    if x.ndim == 2:
        return x
    if width <= 0:
        return np.stack([x, x], axis=1)
    d = int(0.012 * SR * width)
    l = x
    r = np.concatenate([np.zeros(d), x[:-d]]) if d else x
    return np.stack([l, r], axis=1)


def save(name, x, peak=0.89):
    x = stereo(x)
    m = np.max(np.abs(x)) or 1
    x = x / m * peak
    wavfile.write(os.path.join(OUT, name + '.wav'), SR, (x * 32767).astype(np.int16))
    print('wrote', name, f'{len(x) / SR:.2f}s')


# ---- Deep bass impact (trailer hit) ----
def bass_impact(d=3.2, f0=62, f1=28):
    t = t_axis(d)
    freq = f1 + (f0 - f1) * np.exp(-t * 7)
    ph = 2 * np.pi * np.cumsum(freq) / SR
    sub = np.sin(ph) * np.exp(-t * 1.25)
    sub += 0.35 * np.tanh(3 * np.sin(ph)) * np.exp(-t * 2.5)  # harmonic body
    click = bp(rng.standard_normal(len(t)), 900, 5000) * np.exp(-t * 60) * 0.6
    thud = lp(rng.standard_normal(len(t)), 180) * np.exp(-t * 9) * 2.0
    x = sub + click + thud
    return reverb(x, 2.4, 0.22, 3)


# ---- Whooshes (filtered noise sweep with doppler-ish pan) ----
def whoosh(d=1.1, lo=300, hi=4500, peak_at=0.62, seed=0, bright=1.0):
    r = np.random.default_rng(seed)
    t = t_axis(d)
    n = r.standard_normal(len(t))
    out = np.zeros_like(n)
    seg = 512
    pos = t / d
    for i in range(0, len(n), seg):
        p = pos[i]
        fc = lo + (hi - lo) * (np.sin(np.pi * min(1, p / peak_at) / 2) if p < peak_at else 1 - 0.6 * (p - peak_at) / (1 - peak_at))
        bw = fc * 0.9
        sl = slice(max(0, i - 2048), min(len(n), i + seg))
        y = bp(n[sl], max(40, fc - bw / 2), min(20000, fc + bw / 2 * bright))
        out[i:i + seg] = y[-(min(len(n), i + seg) - i):]
    e = np.where(pos < peak_at, (pos / peak_at) ** 2.2, ((1 - pos) / (1 - peak_at)) ** 1.6)
    x = out * e
    pan = np.clip(pos * 1.6 - 0.3, 0, 1)
    st = np.stack([x * np.cos(pan * np.pi / 2) * 1.2, x * np.sin(pan * np.pi / 2) * 1.2], axis=1)
    return reverb(st, 0.9, 0.18, seed + 10)


# ---- Digital shatter (glass + glittering particles) ----
def shatter(d=2.2):
    t = t_axis(d)
    x = hp(rng.standard_normal(len(t)), 2500) * np.exp(-t * 10) * 0.7
    for _ in range(140):
        st = rng.uniform(0, 1.3) ** 1.6
        f = rng.uniform(2500, 11000)
        dur = rng.uniform(0.03, 0.25)
        tt = t_axis(dur)
        ping = np.sin(2 * np.pi * f * tt) * np.exp(-tt * rng.uniform(20, 60)) * rng.uniform(.05, .3) * np.exp(-st * 1.4)
        i = int(st * SR)
        x[i:i + len(ping)] += ping[: len(x) - i]
    body = bp(rng.standard_normal(len(t)), 400, 2000) * np.exp(-t * 18) * 0.8
    x += body
    return reverb(x, 1.6, 0.3, 5)


# ---- UI click + soft digital pop ----
def ui_click():
    t = t_axis(0.35)
    click = bp(rng.standard_normal(len(t)), 2000, 9000) * np.exp(-t * 400)
    pop_f = 900 * np.exp(-t * 18) + 500
    pop = np.sin(2 * np.pi * np.cumsum(pop_f) / SR) * np.exp(-t * 30) * 0.5
    return reverb(click + pop, 0.5, 0.12, 6)


def soft_pop():
    t = t_axis(0.3)
    f = 300 + 900 * np.exp(-t * 40)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 22)
    return reverb(x, 0.4, 0.15, 7)


# ---- Riser (tension build) ----
def riser(d=4.4):
    t = t_axis(d)
    p = t / d
    n = rng.standard_normal(len(t))
    noise = np.zeros_like(n)
    seg = 1024
    for i in range(0, len(n), seg):
        fc = 400 + 6000 * p[i] ** 2
        sl = slice(max(0, i - 4096), min(len(n), i + seg))
        y = bp(n[sl], fc * 0.6, min(20000, fc * 1.5))
        noise[i:i + seg] = y[-(min(len(n), i + seg) - i):]
    f = 110 * 2 ** (p * 2.5)
    tone = sum(np.sin(2 * np.pi * np.cumsum(f * k) / SR) / k for k in (1, 2, 3)) * 0.25
    x = (noise * 0.7 + tone) * p ** 2.4
    return reverb(stereo(x, 0.6), 1.2, 0.25, 8)


# ---- Heartbeat (sub thumps, accelerating) ----
def heartbeat(d=4.6):
    t = t_axis(d)
    x = np.zeros_like(t)
    beat_t, interval = 0.15, 0.82
    while beat_t < d - 0.3:
        for k, amp in ((0, 1.0), (0.17, 0.7)):
            tt = t_axis(0.25)
            f = 55 + 40 * np.exp(-tt * 30)
            th = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 18) * amp
            i = int((beat_t + k) * SR)
            x[i:i + len(th)] += th[: len(x) - i]
        beat_t += interval
        interval = max(0.42, interval * 0.88)
    return lp(x, 220)


# ---- Logo reveal (shimmer swell -> hit -> sparkle tail) ----
def logo_reveal(d=4.5):
    t = t_axis(d)
    hit_at = 1.0
    swell = np.zeros_like(t)
    pre = t < hit_at
    for k, f in enumerate((587.33, 880, 1174.66, 1760)):
        swell += np.sin(2 * np.pi * f * t + k) * 0.18
    swell *= np.where(pre, (t / hit_at) ** 3, np.exp(-(t - hit_at) * 1.1))
    swell = reverb(swell, 2.5, 0.5, 9)[: len(t)]
    imp = np.zeros((len(t), 2))
    b = bass_impact(d - hit_at, 70, 30)[: len(t) - int(hit_at * SR)]
    imp[int(hit_at * SR): int(hit_at * SR) + len(b)] = b * 0.9
    sp = np.zeros_like(t)
    for _ in range(90):
        st = hit_at + rng.uniform(0, 2.6) ** 1.3
        if st > d - 0.2:
            continue
        f = rng.choice([1174.66, 1396.91, 1760, 2349.32, 2793.83, 3520]) * rng.choice([1, 2])
        tt = t_axis(0.4)
        ping = np.sin(2 * np.pi * f * tt) * np.exp(-tt * 9) * rng.uniform(.03, .12)
        i = int(st * SR)
        sp[i:i + len(ping)] += ping[: len(sp) - i]
    sp = reverb(sp, 2.2, 0.45, 11)[: len(t)]
    return swell + imp + sp * 1.2


# ---- Gold CTA pop (bright chime) ----
def gold_pop():
    t = t_axis(1.2)
    x = np.zeros_like(t)
    for f, a, delay in ((1318.5, .5, 0), (1975.5, .4, .06), (2637, .3, .12)):
        tt = t[: len(t) - int(delay * SR)]
        tone = (np.sin(2 * np.pi * f * tt) + .3 * np.sin(2 * np.pi * f * 2.01 * tt)) * np.exp(-tt * 6) * a
        x[int(delay * SR):] += tone
    x += soft_pop()[: len(x), 0] * 0.6 if len(soft_pop()) >= len(x) else 0
    return reverb(x, 1.4, 0.3, 12)


# ---- Drone / room tone for the silent beat ----
def dark_drone(d=4.0):
    t = t_axis(d)
    x = sum(np.sin(2 * np.pi * f * t + i) for i, f in enumerate((36.7, 55, 73.4))) * 0.3
    x += lp(rng.standard_normal(len(t)), 300) * 0.25
    tick = np.zeros_like(t)
    for k in np.arange(0.25, d, 0.5):
        tt = t_axis(0.04)
        c = hp(rng.standard_normal(len(tt)), 3000) * np.exp(-tt * 200) * 0.25
        i = int(k * SR)
        tick[i:i + len(c)] += c[: len(tick) - i]
    e = np.minimum(1, t / 0.6) * np.minimum(1, (d - t) / 0.8)
    return stereo((x + tick) * e, 0.5)


if __name__ == '__main__':
    save('bass_impact', bass_impact())
    save('bass_impact_final', bass_impact(4.0, 75, 26))
    for i, (lo, hi, pk) in enumerate([(250, 5200, .6), (400, 7000, .5), (180, 3500, .7), (300, 6000, .45), (500, 8000, .55), (220, 4200, .65)]):
        save(f'whoosh_{i + 1}', whoosh(1.0 + 0.1 * (i % 3), lo, hi, pk, seed=i))
    save('whoosh_big', whoosh(1.6, 150, 6500, .7, seed=21, bright=1.3))
    save('shatter', shatter())
    save('ui_click', ui_click())
    save('soft_pop', soft_pop())
    save('riser', riser())
    save('heartbeat', heartbeat())
    save('logo_reveal', logo_reveal())
    save('gold_pop', gold_pop())
    save('dark_drone', dark_drone())
