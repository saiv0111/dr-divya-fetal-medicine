import type { SERVICE_IDS } from '@drdivya/shared';

/**
 * Every word on the marketing site lives here. Nothing below is hard-coded in a
 * component, so copy changes never require touching JSX.
 *
 * PLACEHOLDER DATA: practice name, address, phone, email, registration numbers
 * and all figures are stand-ins. Replace before launch.
 */

export const doctor = {
  name: 'Dr Divya Laxmi S V',
  /** Short form for buttons and running copy. */
  shortName: 'Dr Divya',
  /** Shown under the name in the about + footer blocks. */
  credentials: 'MBBS · MS (Obstetrics & Gynaecology) · Fellowship in Fetal Medicine',
  role: 'Fetal Medicine Specialist',
  /** TODO — still a placeholder; supply the real council registration number. */
  registration: 'Medical Council Reg. No. 00000',
} as const;

export const practice = {
  name: 'Dr Divya’s Fetal Medicine Centre',
  tagline: 'Fetal Medicine & Women’s Health',
  phone: '+91 98765 43210',
  phoneHref: 'tel:+919876543210',
  whatsappHref: 'https://wa.me/919876543210',
  email: 'care@drdivyafetalmedicine.com',
  address: {
    line1: 'D.No. 5-50/1/A, Shiva Vijaya Ratna Jewel, 2nd Floor',
    line2: 'Beside Indane Gas, BHEL X Roads, Chanda Nagar',
    city: 'Hyderabad, Ranga Reddy District, Telangana — 500 050',
  },
  mapsEmbedUrl:
    'https://maps.google.com/maps?q=Chanda+Nagar,+BHEL+X+Roads,+Hyderabad,+Telangana+500050&t=&z=16&ie=UTF8&iwloc=&output=embed',
  mapsDirectionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=Shiva+Vijaya+Ratna+Jewel+BHEL+X+Roads+Chanda+Nagar+Hyderabad+Telangana+500050',
  hours: [
    { day: 'Monday – Friday', time: '9:00 AM – 6:00 PM' },
    { day: 'Saturday', time: '9:00 AM – 2:00 PM' },
    { day: 'Sunday', time: 'By Appointment' },
  ],
  socials: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'YouTube', href: 'https://youtube.com' },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/*  1 · Hero                                                                   */
/* -------------------------------------------------------------------------- */

export const hero = {
  eyebrow: 'Fetal Medicine & Women’s Health',
  /** Rendered word-by-word with a mask reveal. `accent` italicises in serif. */
  headline: [
    { text: 'Every' },
    { text: 'heartbeat,' },
    { text: 'clearly', accent: true },
    { text: 'explained.' },
  ],
  body: 'Advanced prenatal diagnostics led by a consultant who sits with you until the picture makes sense. No rushed corridors, no jargon left hanging — just an honest, expert read on how your baby is doing.',
  primaryCta: 'Book a scan',
  secondaryCta: 'Meet Dr. Divya',
  trust: {
    stat: '4.9/5',
    text: 'from 1,200+ families under our care',
  },
} as const;

export const trustMarquee = [
  'MS Obstetrics & Gynaecology',
  'Fellowship-trained in fetal medicine',
  'Nuchal translucency screening',
  'Fetal echocardiography',
  'Doppler & growth surveillance',
  'Genetic counselling',
  'Twin & multiple pregnancy',
  'Invasive prenatal diagnosis',
] as const;

/* -------------------------------------------------------------------------- */
/*  2 · About                                                                  */
/* -------------------------------------------------------------------------- */

export const about = {
  eyebrow: 'About the doctor',
  heading: 'A ten-minute scan. Lasting understanding.',
  /** Rendered with a scroll-linked word highlight — keep it to a few sentences. */
  narrative:
    'I trained in fetal medicine because I kept meeting parents handed a report and no explanation. They knew a measurement was flagged; nobody had told them what it meant. That gap is where worry grows, so this practice is built around closing it.',
  signatureLine: 'Fetal Medicine Specialist',
  facts: [
    { label: 'Practising since', value: '2014' },
    { label: 'Scans performed', value: '24,000+' },
    { label: 'Consultation length', value: '45 min' },
  ],
  pullQuote: 'A screening result is the start of a conversation, never the end of one.',
} as const;

/* -------------------------------------------------------------------------- */
/*  3 · Certifications / credibility                                           */
/* -------------------------------------------------------------------------- */

export const certifications = {
  eyebrow: 'Credentials',
  heading: 'Why families are referred here',
  intro:
    'Six things that shape every appointment — the training behind the scan, and the standard it is held to.',
  items: [
    {
      id: '01',
      title: 'MBBS',
      body: 'Bachelor of Medicine and Bachelor of Surgery, Mamata Medical College.',
    },
    {
      id: '02',
      title: 'MS · Obstetrics & Gynaecology',
      body: 'Postgraduate specialisation at Pinnamaneni Siddhartha Medical College.',
    },
    {
      id: '03',
      title: 'Fellowship in Fetal Medicine',
      body: 'A two-year fellowship at Resolution Fetal Medicine Centre, dedicated entirely to prenatal diagnosis.',
    },
    {
      id: '04',
      title: 'Trained Under Dr Chinmayee Ratha',
      body: 'Fellowship training with one of the country’s established fetal medicine specialists.',
    },
    {
      id: '05',
      title: 'Complex & High-Risk Referrals',
      body: 'Growth restriction, monochorionic twins, structural anomalies and recurrent loss — managed hands-on, not handed onward.',
    },
    {
      id: '06',
      title: 'Counselling That Slows Down',
      body: 'Findings explained in plain language, written down before you leave, and revisited as often as you need them to be.',
    },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/*  4 · Stats                                                                  */
/* -------------------------------------------------------------------------- */

export const stats = {
  eyebrow: 'By the numbers',
  heading: 'Eleven years, measured',
  items: [
    { value: 24000, suffix: '+', label: 'Scans performed', sub: 'Since 2014' },
    { value: 11, suffix: ' yrs', label: 'In fetal medicine', sub: 'Exclusive practice' },
    { value: 98, suffix: '%', label: 'Would recommend', sub: 'Post-visit survey' },
    { value: 48, suffix: ' hrs', label: 'Referral to appointment', sub: 'Median wait' },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/*  5 · Services                                                               */
/* -------------------------------------------------------------------------- */

type ServiceId = (typeof SERVICE_IDS)[number];

export interface Service {
  id: ServiceId;
  index: string;
  name: string;
  window: string;
  duration: string;
  summary: string;
  includes: string[];
}

export const services = {
  eyebrow: 'What we do',
  heading: 'Care you can actually book',
  intro:
    'Every appointment is consultant-performed and consultant-reported. Prices and preparation notes are confirmed when you book.',
  items: [
    {
      id: 'early-viability',
      index: '01',
      name: 'Early Viability Scan',
      window: '6 – 10 weeks',
      duration: '20 min',
      summary:
        'Confirms the pregnancy is in the right place, that there is a heartbeat, and how many babies there are.',
      includes: ['Location & number', 'Cardiac activity', 'Accurate dating', 'Written report'],
    },
    {
      id: 'nt-scan',
      index: '02',
      name: 'NT & First Trimester Screening',
      window: '11 – 13+6 weeks',
      duration: '30 min',
      summary:
        'FMF-certified combined screening: nuchal translucency, nasal bone, Dopplers and early anatomy.',
      includes: [
        'NT measurement',
        'Combined risk score',
        'Pre-eclampsia risk',
        'Early anomaly survey',
      ],
    },
    {
      id: 'anomaly-scan',
      index: '03',
      name: 'Detailed Anomaly Scan',
      window: '18 – 22 weeks',
      duration: '45 min',
      summary:
        'The full structural examination — every organ system reviewed against ISUOG protocol.',
      includes: ['Head to toe anatomy', 'Cardiac outflows', 'Placenta & cord', 'Cervical length'],
    },
    {
      id: 'fetal-echo',
      index: '04',
      name: 'Fetal Echocardiography',
      window: '20 – 26 weeks',
      duration: '45 min',
      summary:
        'A dedicated cardiac study for family history, diabetes, twins, or when a four-chamber view raised a question.',
      includes: ['Segmental analysis', 'Rhythm assessment', 'Colour & PW Doppler', 'Cardiology liaison'],
    },
    {
      id: 'growth-doppler',
      index: '05',
      name: 'Growth & Doppler Surveillance',
      window: '26 weeks onward',
      duration: '30 min',
      summary:
        'Serial biometry with umbilical, middle cerebral and ductus venosus Dopplers to track wellbeing over time.',
      includes: ['Estimated fetal weight', 'Centile trend', 'Doppler indices', 'Amniotic fluid'],
    },
    {
      id: 'high-risk-consult',
      index: '06',
      name: 'High-Risk Pregnancy Consult',
      window: 'Any gestation',
      duration: '60 min',
      summary:
        'A planning appointment for complex pregnancies — twins, prior loss, medical conditions or an abnormal finding elsewhere.',
      includes: ['Records review', 'Care plan', 'Delivery timing', 'Multidisciplinary referral'],
    },
    {
      id: 'genetic-counselling',
      index: '07',
      name: 'Genetic Counselling & Testing',
      window: 'From 10 weeks',
      duration: '45 min',
      summary:
        'NIPT, CVS and amniocentesis explained properly — what each answers, what it costs you, and what it cannot tell you.',
      includes: ['Family history', 'Test selection', 'Procedure under ultrasound', 'Results review'],
    },
  ] satisfies Service[],
} as const;

/* -------------------------------------------------------------------------- */
/*  6 · Baby's journey  (placeholder content — client copy pending)            */
/* -------------------------------------------------------------------------- */

export const journey = {
  eyebrow: 'The first 40 weeks',
  heading: 'Watch your baby’s journey, week by week',
  intro:
    'Every pregnancy has its own rhythm. Scroll through the milestones, or tap one, to see what each scan looks for.',
  scrollHint: 'Scroll to watch the journey',
  /** PLACEHOLDER — replace with the client's final milestone copy. */
  stages: [
    {
      week: 'Week 8',
      size: 'Size of a raspberry',
      title: 'Early Pregnancy Assessment',
      body: 'Confirming the pregnancy is in the right place, finding the heartbeat, and dating it accurately — every measurement that follows depends on this one.',
      scan: 'Early Pregnancy Scan',
      serviceId: 'early-viability',
      includes: ['Location & number', 'Cardiac activity', 'Accurate dating', 'Written report'],
    },
    {
      week: 'Week 12',
      size: 'Size of a lime',
      title: 'NT & First Trimester Screening',
      body: 'Nuchal translucency, nasal bone and Dopplers, combined with blood markers into a single clear risk assessment — inside a narrow, unmissable window.',
      scan: 'NT Scan',
      serviceId: 'nt-scan',
      includes: ['NT measurement', 'Combined risk score', 'Pre-eclampsia risk', 'Early anomaly survey'],
    },
    {
      week: 'Week 20',
      size: 'Size of a banana',
      title: 'Detailed Anomaly Scan',
      body: 'Every organ system reviewed in turn, from the four chambers of the heart to the full length of the spine. The most thorough examination of your pregnancy.',
      scan: 'Anomaly Scan',
      serviceId: 'anomaly-scan',
      includes: ['Head to toe anatomy', 'Cardiac outflows', 'Placenta & cord', 'Cervical length'],
    },
    {
      week: 'Week 28',
      size: 'Size of an aubergine',
      title: 'Growth & Wellbeing',
      body: 'Plotting growth against a personalised centile and reading placental Dopplers to check the supply is keeping pace with an increasingly demanding baby.',
      scan: 'Growth & Doppler Scan',
      serviceId: 'growth-doppler',
      includes: ['Estimated fetal weight', 'Centile trend', 'Doppler indices', 'Amniotic fluid'],
    },
    {
      week: 'Week 36',
      size: 'Size of a papaya',
      title: 'Pre-Delivery Assessment',
      body: 'Position, fluid volume, estimated weight and cord flow — the findings your delivery plan is actually built from.',
      scan: 'Growth & Presentation Scan',
      serviceId: 'growth-doppler',
      includes: ['Position & fluid volume', 'Estimated fetal weight', 'Cord flow indices', 'Delivery timing'],
    },
    {
      week: 'Week 40',
      size: 'Full term',
      title: 'Ready to Meet You',
      body: 'Final wellbeing checks, coordinated closely with your obstetric team as labour approaches.',
      scan: 'Final Wellbeing Scan',
      serviceId: 'high-risk-consult',
      includes: ['Final wellbeing check', 'Placental grading', 'Obstetric coordination', '24/7 care plan'],
    },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/*  7 · Testimonials                                                           */
/* -------------------------------------------------------------------------- */

export const testimonials = {
  eyebrow: 'In their words',
  heading: 'Stories that begin with relief',
  items: [
    {
      quote:
        'Our 20-week scan flagged something at another clinic and we spent four days assuming the worst. Dr. Divya rescanned us, showed us exactly what she was looking at, and explained why it was a normal variant. I have never been so grateful for forty-five unhurried minutes.',
      name: 'Ananya & Rohit',
      context: 'Anomaly scan · second pregnancy',
    },
    {
      quote:
        'Monochorionic twins meant fortnightly appointments from sixteen weeks. Not once did it feel like a conveyor belt. She knew our names, our history and our worries every single time.',
      name: 'Priya M.',
      context: 'Twin pregnancy · 22 visits',
    },
    {
      quote:
        'I came in with a high-risk NIPT result and a head full of internet searches. She drew the difference between screening and diagnosis on a piece of paper and let me keep it. That page got me through the next two weeks.',
      name: 'Sneha K.',
      context: 'Genetic counselling',
    },
    {
      quote:
        'After two losses, we were terrified of every scan. She started booking us in at the end of the day so there was no rush and no waiting room. Our daughter is fourteen months old now.',
      name: 'Meera & Arjun',
      context: 'Recurrent loss · early monitoring',
    },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/*  8 · Location                                                               */
/* -------------------------------------------------------------------------- */

export const location = {
  eyebrow: 'Find us',
  heading: 'One clinic, easy to reach',
  intro:
    'Ground-level access, a quiet waiting area kept deliberately small, and parking in the same building.',
  amenities: [
    'Basement parking (validated)',
    '400m from Indiranagar metro',
    'Step-free access & lift',
    'Private changing room',
    'Partner always welcome',
  ],
} as const;

/* -------------------------------------------------------------------------- */
/*  9 · CTA                                                                    */
/* -------------------------------------------------------------------------- */

export const cta = {
  eyebrow: 'Next step',
  heading: 'Bring your questions. All of them.',
  body: 'Most appointments are offered within 48 hours of referral. Self-referrals are welcome — you do not need a letter to book a scan.',
  primary: 'Book an appointment',
  secondary: 'Call the clinic',
} as const;

/* -------------------------------------------------------------------------- */
/*  10 · FAQs                                                                  */
/* -------------------------------------------------------------------------- */

export const faqs = {
  eyebrow: 'Good questions',
  heading: 'Answered before you have to ask',
  items: [
    {
      q: 'Do I need a referral from my obstetrician?',
      a: 'No. Self-referrals are welcome for every scan we offer. If you do have a referral letter or prior reports, bring them — they help us see the trend rather than a single snapshot. With your consent we send a copy of every report back to your obstetrician the same day.',
    },
    {
      q: 'How quickly can I be seen?',
      a: 'Median wait from enquiry to appointment is under 48 hours, and urgent referrals are usually accommodated the same or next working day. Time-critical windows — the 11 to 13+6 week NT scan in particular — are always prioritised.',
    },
    {
      q: 'Who actually performs the scan?',
      a: 'Dr. Divya performs, interprets and reports every scan personally. You will not be scanned by one person and given results by another, and the person explaining the findings is the person who saw them on the screen.',
    },
    {
      q: 'Can my partner or family come with me?',
      a: 'Yes, and we would encourage it. The consulting room comfortably seats two guests, and older children are welcome. If a scan may carry difficult news, we will suggest you bring someone with you.',
    },
    {
      q: 'What do I need to do to prepare?',
      a: 'For scans before 12 weeks, a comfortably full bladder helps. After that, no preparation is needed at all — just wear something that makes your abdomen easy to reach. Eating normally beforehand genuinely helps: active babies are easier to examine.',
    },
    {
      q: 'What happens if something is found?',
      a: 'You will be told in the room, in plain language, before you leave. We set out what is known, what is still uncertain, and what the next test or appointment would add. Where another specialist is needed — cardiology, genetics, neonatology — that referral is made while you are still with us, not weeks later.',
    },
    {
      q: 'Will my results be shared with anyone else?',
      a: 'Only with clinicians you name. Reports go to you first and to your referring obstetrician with your consent. Records are held securely and never used for marketing.',
    },
    {
      q: 'Do you offer 3D or 4D keepsake imaging?',
      a: 'Volume imaging is available and included where it adds diagnostic value, typically around 26 to 30 weeks when facial detail is clearest. It is offered as part of a clinical appointment rather than as a standalone souvenir scan.',
    },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/*  Navigation                                                                 */
/* -------------------------------------------------------------------------- */

export const navLinks = [
  { label: 'About', href: '/#about' },
  { label: 'Credentials', href: '/#credentials' },
  { label: 'Services', href: '/#services' },
  { label: 'Journey', href: '/#journey' },
  { label: 'Visit', href: '/#location' },
  { label: 'Blogs', href: '/blog' },
] as const;

export const footer = {
  wordmark: 'Dr. Divya',
  blurb:
    'Consultant-led fetal medicine and women’s healthcare. Clear answers, current evidence, and the time to talk it through.',
  newsletter: {
    heading: 'Notes from the clinic',
    body: 'One considered email a month on prenatal screening, new evidence, and what it means for you. No marketing.',
    cta: 'Subscribe',
  },
  columns: [
    {
      title: 'Explore',
      links: [
        { label: 'About Dr. Divya', href: '/#about' },
        { label: 'Credentials', href: '/#credentials' },
        { label: 'Services', href: '/#services' },
        { label: 'Baby’s journey', href: '/#journey' },
        { label: 'Blogs', href: '/blog' },
      ],
    },
    {
      title: 'Appointments',
      links: [
        { label: 'Book a scan', href: '#book' },
        { label: 'NT screening', href: '/#services' },
        { label: 'Anomaly scan', href: '/#services' },
        { label: 'High-risk consult', href: '/#services' },
        { label: 'FAQs', href: '/#faqs' },
      ],
    },
  ],
  legal: [
    { label: 'Privacy notice', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Patient charter', href: '#' },
  ],
  disclaimer:
    'Information on this site is general and educational. It is not a substitute for a consultation. If you have an urgent concern about your pregnancy, contact your maternity unit or emergency services.',
} as const;
