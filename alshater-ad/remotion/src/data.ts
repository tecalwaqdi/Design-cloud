// Ad-time cue points (seconds). VO take A word timings (ElevenLabs Scribe alignment):
// VO part 1 (0–6.45 s of the take) is placed at +0.30 s, part 2 (6.45 s → end) at +0.85 s (a beat of silence before «لا…»).
const a = (vo: number) => +(vo + (vo < 6.45 ? 0.3 : 0.85)).toFixed(2);
export const T = {
  sijil: a(0.08), baladiya: a(1.12), difa: a(2.08), zakat: a(2.96),
  kull: a(4.297), mishwar: a(5.12),
  la: a(6.64), khalliha: a(7.28), shater: a(7.84),
  name: a(8.768), licensed: a(10.64), experience: a(11.68),
  nukhallis: a(13.907), svcSijil: a(14.48), svcBaladiya: a(15.6), svcSalama: a(16.64),
  zatca: a(17.92), taxNo: a(20.0),
  binaa: a(21.76), mukhattat: a(23.68),
  nadhafa: a(25.92), hasharat: a(27.04), ijar: a(28.4),
  arbaeen: a(29.68), nurajiha: a(31.76), diqqa: a(32.96), sura: a(33.76), wudooh: a(34.56),
  shiarna: a(35.28), najahkum: a(36.48), najahLana: a(37.36),
  tawasal: a(38.67), name2: a(39.68), jeddah: a(41.52),
  finalHit: 48.72, // music resolve (music_a 48.33 s placed at +0.39 s)
};
// From the profile PDF (contact page) and the services flyer.
export const CONTACT = {
  phones: ['0558874875', '0562857490', '0534445343'],
  web: 'alshater.sa',
  social: '@alshater_jeddah',
  hq: 'المركز الرئيسي: جدة – حي البوادي',
  branch: 'فرع: جدة – حي مشرفة، مركز الشعلة التجاري',
};
