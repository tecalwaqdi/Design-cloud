# إعلان أبو كيان للخدمات العقارية (45 ثانية، عمودي 9:16)

## الملفات الجاهزة
| الملف | الوصف |
|---|---|
| `output/AbuKayan_Ad_45s_1080x1920.mp4` | **النسخة النهائية (الثانية):** بهوية الشعار، مع صوت وموسيقى ومؤثرات |
| `output/AbuKayan_Ad_45s_1080x1920_NO_VO.mp4` | نفس الفيديو بدون تعليق صوتي |
| `output/AbuKayan_draft_preview_lowres.mp4` | معاينة خفيفة للجوال |
| `brand_export/` | الشعار بالاسم الجديد: نسخة على كحلي 1672×941، ونسخة مربعة 1080 لصورة الحساب، ونسختان بخلفية شفافة (للخلفيات الداكنة والفاتحة)، والرمز بصيغة SVG |
| `SCRIPT.md` | سكربت النسخة الثانية مع جدول الهوية والكابشن |
| `output/v1/`, `SCRIPT_v1.md` | النسخة الأولى (النيون)، محفوظة للمرجع |

## الهوية البصرية
- **الألوان:** مأخوذة مباشرة من الشعار: كحلي `#12223C`، ونحاسي `#C7926D`، وكريمي `#F3ECE2`.
- **الشعار:** رمز المباني مع حرف K، مرسوم كـ SVG مطابق للشعار الأصلي (`assets/brand/mark.svg`)، والاسم «أبو كيان للخدمات العقارية» بخط DIN Next LT Arabic Bold.
- **الخطوط:** DIN Next LT Arabic للعناوين والنصوص، وIBM Plex Arabic للنصوص الصغيرة. الملفات اللي أرسلتها محفوظة في `assets/fonts`.
- **القالب:** أقواس معمارية نحاسية رفيعة، ومستويات ضوء قُطرية (مثل خلفية الشعار)، وصور داخل إطار قوس، وأرقام مفرّغة للركائز، وانتقال «باب» بين المشاهد، وخط نحاسي يمسح الشاشة بين الركائز.

## مصادر المحتوى
- **التعليق:** ElevenLabs eleven_v4، صوت Faisal Alotaibi.
- **الموسيقى:** ElevenLabs Music v2.5، وتأكدنا بالتفريغ النصي أنها خالية من الغناء.
- **المؤثرات:** ElevenLabs (المفاتيح وضربة الشعار والختم)، والباقي من `lufy-store-ad/assets/audio/sfx`.
- **الصور:** مولّدة بالذكاء الاصطناعي (gpt-image-2.5، عمودية 2K) بألوان الهوية. البدائل غير المستخدمة موجودة في `assets/img`.
- **الموشن:** Remotion 4.

## ملاحظات
1. الصور والصوت مولّدة بالذكاء الاصطناعي، فلا تمثّل عقارات أو عملاء حقيقيين. فعّل خيار «محتوى مولّد بالذكاء الاصطناعي» في تيك توك.
2. خطوط DIN Next LT Arabic تجارية. تأكد من الترخيص قبل الاستخدام التجاري خارج هذا الإعلان.
3. سطر «شقق · فلل · أراضي» في الخاتمة تقدر تعدّله في `remotion/src/AbuKayanAd.tsx`.

## إعادة البناء
```bash
scripts/prepare_public.sh
cd remotion && npm install && npm run render -- --timeout=120000   # -> output/abu_kayan_video_only.mp4
cd .. && python3 scripts/mix.py                                     # -> output/mix_full.wav, mix_no_vo.wav
cd output && ffmpeg -i abu_kayan_video_only.mp4 -i mix_full.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k AbuKayan_Ad_45s_1080x1920.mp4
node scripts/export_logo.cjs                                        # -> brand_export/*.png
```

---

# النسخة الثالثة A: «الكل يرسل لك عروض… أبو كيان يسألك عنك» (60 ثانية)
تنفيذ `v3/SCRIPT_A_v2.md` بهوية الشعار (كحلي ونحاسي وكريمي، وخط DIN Next Arabic، والرمز المتحرك).

| الملف | الوصف |
|---|---|
| `output/v3/AbuKayan_v3A_60s_1080x1920_NO_VO.mp4` | الفيديو كامل مع الموسيقى والمؤثرات، وكلام التعليق مكتوب على الشاشة. ينقصه صوت رائد |
| `output/v3/AbuKayan_v3A_preview_lowres.mp4` | معاينة خفيفة للجوال |
| `v3/VO_PROMPT_A_v2.txt` | نص التعليق لصوت RAED ALOTAIBI مع التوقيت المطلوب لكل سطر |
| `remotion/src/V3A.tsx` | المونتاج (Composition: `AbuKayanV3A`) |
| `scripts/mix_v3a.py` | المكساج: إشعارات واهتزاز مولّدة، والموسيقى تنقطع عند لحظة الصمت (15–19 ث) |

**لإضافة صوت رائد:** ولّد النص من `v3/VO_PROMPT_A_v2.txt` واحفظه في `assets/audio/v3/vo_raed.mp3`، واملأ `VO_LINES` في `scripts/mix_v3a.py`، وبعدها:
```bash
scripts/prepare_public.sh
cd remotion && npx remotion render src/index.ts AbuKayanV3A ../output/v3/abu_kayan_v3a_video_only.mp4 --codec=h264 --crf=16 --muted
cd .. && python3 scripts/mix_v3a.py
cd output/v3 && ffmpeg -i abu_kayan_v3a_video_only.mp4 -i mix_v3a_full.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k AbuKayan_v3A_60s_1080x1920.mp4
```
**ملاحظات:** صورة الشقة (المطبخ) مولّدة بالذكاء الاصطناعي، وتجنّبت صور الأفق لأنها تُظهر الرياض مو جدة. أسماء الوسطاء والأرقام (38 محادثة، 5 دقايق، 900 ألف) أمثلة توضيحية.
