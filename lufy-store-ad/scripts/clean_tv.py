"""Remove AI-garbled broadcast graphics from the TV in livingroom_v2.mp4 (locked-off camera, slow push-in).

Graphic boxes were measured on the first and last frames and are interpolated per frame.
- Scoreboard (lower-left of the TV picture): filled with the grass directly above it (feathered copy).
- Top-left badge / top-right score bug (on the night sky): filled by vertical interpolation between
  the rows just above and below each box, plus a little grain so the fill blends.
The viewer's head never overlaps any of these boxes (scoreboard right edge <= 815 px, head starts ~880 px).

Output: assets/video/livingroom_clean.mp4 (1920x1080, 24 fps)
"""
import os
import subprocess
import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SRC = os.path.join(ROOT, 'assets/video/livingroom_v2.mp4')
DST = os.path.join(ROOT, 'assets/video/livingroom_clean.mp4')
W, H, FPS = 1920, 1080, 24
T_END = 4.9

# (x0, y0, x1, y1) at t=0 and at t=T_END
SCORE = ((478, 608, 818, 696), (414, 641, 799, 741))
BADGE_L = ((478, 176, 688, 219), (414, 160, 651, 208))
BADGE_R = ((1331, 178, 1455, 214), (1372, 162, 1508, 201))
rng = np.random.default_rng(3)


def at(box, t):
    k = min(1.0, max(0.0, t / T_END))
    a, b = box
    return [a[i] + (b[i] - a[i]) * k for i in range(4)]


def feather(h, w, r):
    yy = np.minimum(np.arange(h), np.arange(h)[::-1]) / r
    xx = np.minimum(np.arange(w), np.arange(w)[::-1]) / r
    return np.clip(np.minimum(yy[:, None], xx[None, :]), 0, 1)[..., None]


def copy_from_above(f, box, pad=26):
    x0, y0, x1, y1 = [int(round(v)) for v in box]
    x0, y0, x1, y1 = x0 - pad, y0 - pad, x1 + pad, y1 + pad
    h, w = y1 - y0, x1 - x0
    sy = y0 - int((h - 2 * pad) * 1.15) - 4
    src = f[sy:sy + h, x0:x1].astype(np.float32)
    dst = f[y0:y1, x0:x1].astype(np.float32)
    # colour-match the copied grass to the ring around the hole (left/right/bottom borders)
    ring = np.concatenate([dst[:, :pad // 2].reshape(-1, 3), dst[:, -pad // 2:].reshape(-1, 3), dst[-pad // 2:].reshape(-1, 3)])
    sring = np.concatenate([src[:, :pad // 2].reshape(-1, 3), src[:, -pad // 2:].reshape(-1, 3), src[-pad // 2:].reshape(-1, 3)])
    src = src - sring.mean(axis=0) + ring.mean(axis=0)
    # vertical brightness ramp: match top and bottom rows separately (pitch perspective gradient)
    k = np.linspace(0, 1, h)[:, None, None]
    dtop, dbot = dst[:4].mean(axis=(0, 1)), dst[-4:].mean(axis=(0, 1))
    stop, sbot = src[:4].mean(axis=(0, 1)), src[-4:].mean(axis=(0, 1))
    src = src + (dtop - stop) * (1 - k) + (dbot - sbot) * k
    m = feather(h, w, pad)
    f[y0:y1, x0:x1] = (src * m + dst * (1 - m)).clip(0, 255).astype(np.uint8)


def vfill(f, box, pad=8):
    x0, y0, x1, y1 = [int(round(v)) for v in box]
    x0, y0, x1, y1 = x0 - pad, y0 - pad, x1 + pad, y1 + pad
    top = f[y0 - 3:y0, x0:x1].astype(np.float32).mean(axis=0)
    bot = f[y1:y1 + 3, x0:x1].astype(np.float32).mean(axis=0)
    h = y1 - y0
    k = np.linspace(0, 1, h)[:, None, None]
    fill = top[None] * (1 - k) + bot[None] * k
    fill += rng.normal(0, 2.0, fill.shape)
    dst = f[y0:y1, x0:x1].astype(np.float32)
    m = feather(h, x1 - x0, pad)
    f[y0:y1, x0:x1] = (fill * m + dst * (1 - m)).clip(0, 255).astype(np.uint8)


def main():
    dec = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-i', SRC, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
    enc = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                            '-c:v', 'libx264', '-crf', '12', '-preset', 'slow', '-pix_fmt', 'yuv420p', DST], stdin=subprocess.PIPE)
    n = 0
    while True:
        buf = dec.stdout.read(W * H * 3)
        if len(buf) < W * H * 3:
            break
        f = np.frombuffer(buf, np.uint8).reshape(H, W, 3).copy()
        t = n / FPS
        copy_from_above(f, at(SCORE, t))
        vfill(f, at(BADGE_L, t))
        vfill(f, at(BADGE_R, t))
        enc.stdin.write(f.tobytes())
        n += 1
    enc.stdin.close()
    enc.wait()
    print('frames', n)


if __name__ == '__main__':
    main()
