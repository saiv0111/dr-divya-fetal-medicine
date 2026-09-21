import type { Post, PostSummary } from '@drdivya/shared';

/**
 * Editorial content lives here for now. Swap this module for a CMS/database
 * read later — every route only depends on the exported functions below.
 */
const posts: Post[] = [
  {
    slug: 'what-happens-at-the-nt-scan',
    title: 'What actually happens at your 11–13 week NT scan',
    excerpt:
      'The first detailed look at your baby. Here is what we measure, why the timing window is so narrow, and what the numbers do and do not mean.',
    category: 'Fetal Medicine',
    publishedAt: '2026-08-28',
    readingMinutes: 6,
    cover: { tone: 'rose', label: 'First trimester' },
    featured: true,
    body: [
      {
        type: 'paragraph',
        text: 'The nuchal translucency (NT) scan is usually the first appointment where your baby stops being an abstract idea and becomes a profile on a screen — a spine, a nose, ten fingers. It is also the first genuinely diagnostic scan of your pregnancy, and that combination makes it the appointment most parents arrive at with the highest pulse rate.',
      },
      { type: 'heading', text: 'Why the window is 11 weeks to 13 weeks and 6 days' },
      {
        type: 'paragraph',
        text: 'The measurement we take relies on a thin, fluid-filled space at the back of the baby’s neck. Before 11 weeks the baby is simply too small for the measurement to be reproducible; after 14 weeks the fluid is reabsorbed and the window closes. The crown-rump length needs to sit between roughly 45mm and 84mm for the result to be valid.',
      },
      { type: 'heading', text: 'What we are looking at' },
      {
        type: 'list',
        items: [
          'Nuchal translucency thickness, measured in a strict mid-sagittal plane',
          'Nasal bone presence, and flow across the tricuspid valve and ductus venosus',
          'Early anatomy: skull shape, abdominal wall, bladder, stomach, limbs',
          'Whether this is a single pregnancy, and if not, how the placentas are arranged',
          'Uterine artery Dopplers, which feed into your pre-eclampsia risk assessment',
        ],
      },
      { type: 'heading', text: 'Reading a risk score without panicking' },
      {
        type: 'paragraph',
        text: 'The scan produces a combined risk — the NT measurement, your age, and two blood markers together. A result of 1 in 300 does not mean something is wrong. It means that out of 300 pregnancies with an identical profile, 299 are unaffected. Screening narrows a population; it does not diagnose an individual.',
      },
      {
        type: 'callout',
        text: 'A screening result is a starting point for a conversation, never the end of one. If yours comes back higher than expected, the next step is a discussion about NIPT or diagnostic testing — not a decision made in the car park.',
      },
      {
        type: 'paragraph',
        text: 'Plan for the appointment to take around 30 minutes, and bring whoever you want beside you. You will leave with images, the measurements written down, and enough time to ask every question you thought of on the way in.',
      },
    ],
  },
  {
    slug: 'anomaly-scan-checklist',
    title: 'The 20-week anomaly scan, organ by organ',
    excerpt:
      'A detailed walk through everything examined during the mid-pregnancy scan — and an honest account of what ultrasound can and cannot detect.',
    category: 'Pregnancy Care',
    publishedAt: '2026-08-14',
    readingMinutes: 8,
    cover: { tone: 'sand', label: 'Second trimester' },
    body: [
      {
        type: 'paragraph',
        text: 'Between 18 and 22 weeks, the baby is large enough for detailed anatomy and still small enough to move into the positions we need. This is the single most thorough structural examination of the pregnancy, and it takes time — expect 45 minutes, longer if your baby is determined to stay face-down.',
      },
      { type: 'heading', text: 'The systematic sweep' },
      {
        type: 'list',
        items: [
          'Head: skull shape and integrity, ventricles, cerebellum, cavum septi pellucidi',
          'Face: orbits, profile, lips and palate where the view allows',
          'Chest: lungs, diaphragm, a four-chamber heart view plus outflow tracts',
          'Abdomen: stomach, kidneys, bladder, bowel, and the cord insertion',
          'Spine: examined in three planes, from the neck to the sacrum',
          'Limbs: all long bones measured, hands and feet counted and oriented',
          'Placenta: position relative to the cervix, and umbilical cord vessels',
        ],
      },
      { type: 'heading', text: 'What ultrasound cannot see' },
      {
        type: 'paragraph',
        text: 'A normal anomaly scan is genuinely reassuring, but it is not a guarantee. Ultrasound detects roughly half of congenital heart conditions and a much smaller share of subtle conditions. It cannot detect most chromosomal or metabolic conditions, and it cannot predict developmental outcomes. Being told this clearly is part of the scan, not a footnote to it.',
      },
      {
        type: 'callout',
        text: 'If a finding needs a second look, being called back is routine rather than ominous. Many soft markers resolve entirely by the growth scan.',
      },
    ],
  },
  {
    slug: 'understanding-doppler-studies',
    title: 'Doppler studies: what blood flow tells us about wellbeing',
    excerpt:
      'Umbilical artery, middle cerebral artery, ductus venosus — a plain-language guide to the waveforms behind growth monitoring.',
    category: 'High-Risk Pregnancy',
    publishedAt: '2026-07-30',
    readingMinutes: 7,
    cover: { tone: 'sage', label: 'Monitoring' },
    body: [
      {
        type: 'paragraph',
        text: 'When a baby is measuring small, the measurement itself is only half the question. The other half is whether the baby is small and thriving, or small because the placenta is under strain. Doppler ultrasound answers that by showing us how blood is actually moving.',
      },
      { type: 'heading', text: 'The three vessels that matter most' },
      {
        type: 'list',
        items: [
          'Umbilical artery — rising resistance is the earliest sign of placental strain',
          'Middle cerebral artery — falling resistance suggests blood is being redirected to the brain',
          'Ductus venosus — changes here indicate the cardiovascular system is under real pressure',
        ],
      },
      {
        type: 'paragraph',
        text: 'These three deteriorate in a broadly predictable sequence, which is precisely what makes them useful. Serial Dopplers turn a single worrying measurement into a trend, and a trend is something you can plan around — including the timing of delivery.',
      },
      {
        type: 'callout',
        text: 'One abnormal Doppler rarely changes a plan on its own. The pattern across several appointments is what guides decisions.',
      },
    ],
  },
  {
    slug: 'nipt-versus-diagnostic-testing',
    title: 'NIPT, amniocentesis, CVS: choosing between them',
    excerpt:
      'Screening tells you a probability. Diagnostic testing gives you an answer, with a small procedural risk. Here is how to weigh that.',
    category: 'Genetics',
    publishedAt: '2026-07-11',
    readingMinutes: 9,
    cover: { tone: 'rose', label: 'Genetics' },
    body: [
      {
        type: 'paragraph',
        text: 'The distinction that matters most is also the one most often blurred: NIPT is a screening test, while CVS and amniocentesis are diagnostic. NIPT analyses fragments of placental DNA circulating in your blood and returns a probability. A diagnostic test samples fetal cells directly and returns a karyotype.',
      },
      { type: 'heading', text: 'Where NIPT is strong, and where it is not' },
      {
        type: 'paragraph',
        text: 'For trisomy 21, NIPT detects over 99% of cases with a very low false-positive rate. Its performance for rarer trisomies and microdeletions is meaningfully lower, and a small share of samples return no result at all because the fetal fraction is too low. A high-risk NIPT result should always be confirmed diagnostically before any irreversible decision.',
      },
      { type: 'heading', text: 'The procedural question' },
      {
        type: 'list',
        items: [
          'CVS: from 11 weeks, samples placental tissue, results in days',
          'Amniocentesis: from 15 weeks, samples amniotic fluid, the reference standard',
          'Miscarriage risk in experienced hands is now quoted at well under 1 in 200',
        ],
      },
      {
        type: 'callout',
        text: 'There is no universally correct choice here. The right test depends on what you would do with the answer — which is exactly what a counselling appointment is for.',
      },
    ],
  },
  {
    slug: 'twin-pregnancy-monitoring',
    title: 'Why twin pregnancies are scanned so much more often',
    excerpt:
      'Chorionicity decides the entire monitoring schedule. Understanding yours explains every appointment that follows.',
    category: 'High-Risk Pregnancy',
    publishedAt: '2026-06-24',
    readingMinutes: 6,
    cover: { tone: 'sand', label: 'Multiples' },
    body: [
      {
        type: 'paragraph',
        text: 'The first and most consequential question in a twin pregnancy is not whether the babies are identical. It is whether they share a placenta. That is chorionicity, it is best established before 14 weeks, and it sets the intensity of everything that follows.',
      },
      { type: 'heading', text: 'Dichorionic versus monochorionic' },
      {
        type: 'paragraph',
        text: 'Dichorionic twins have separate placentas and are typically scanned every four weeks from 20 weeks. Monochorionic twins share one, with vascular connections running between them, and are scanned fortnightly from 16 weeks — largely to catch twin-to-twin transfusion syndrome early, when it is most treatable.',
      },
      {
        type: 'callout',
        text: 'If you are carrying monochorionic twins, the fortnightly schedule is not a sign that something is wrong. It is the standard of care that keeps things right.',
      },
    ],
  },
  {
    slug: 'preparing-for-your-first-visit',
    title: 'How to get the most out of your first fetal medicine visit',
    excerpt:
      'What to bring, what to ask, and how to hold onto the answers once you are back home.',
    category: "Women's Health",
    publishedAt: '2026-06-02',
    readingMinutes: 4,
    cover: { tone: 'sage', label: 'Practical' },
    body: [
      {
        type: 'paragraph',
        text: 'Referral appointments carry a lot of emotional weight, and almost everyone finds that the details evaporate somewhere between the consulting room and the car park. A little preparation changes that entirely.',
      },
      { type: 'heading', text: 'Bring with you' },
      {
        type: 'list',
        items: [
          'Every prior scan report and image, including from other clinics',
          'A current list of medications and supplements, with doses',
          'Relevant family history on both sides — cardiac, genetic, recurrent loss',
          'Your written questions, in priority order',
          'Someone whose only job is to take notes',
        ],
      },
      {
        type: 'callout',
        text: 'Ask for the explanation twice if you need it. Nobody absorbs new information the first time they hear it, and no good clinician expects you to.',
      },
    ],
  },
];

const byNewest = (a: Post, b: Post) => b.publishedAt.localeCompare(a.publishedAt);

const toSummary = ({ body: _body, ...summary }: Post): PostSummary => summary;

export const listPosts = (category?: string): PostSummary[] =>
  posts
    .filter((post) => !category || post.category.toLowerCase() === category.toLowerCase())
    .sort(byNewest)
    .map(toSummary);

export const getPost = (slug: string): Post | undefined => posts.find((post) => post.slug === slug);

export const listCategories = (): string[] => [...new Set(posts.map((post) => post.category))];
