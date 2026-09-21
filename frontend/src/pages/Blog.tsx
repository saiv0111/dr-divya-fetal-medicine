import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import type { PostSummary } from '@drdivya/shared';
import { getPost, listPosts } from '@/data/posts';
import { EASE, viewportOnce } from '@/lib/motion';
import { cn, formatDate } from '@/lib/utils';
import { lockScroll } from '@/hooks/useLenis';
import { Eyebrow } from '@/components/ui/SectionHeading';
import { SplitWords } from '@/components/ui/SplitWords';
import { Marquee } from '@/components/ui/Marquee';
import { Button } from '@/components/ui/Button';
import { useBooking } from '@/components/booking/BookingContext';

const COVER_TONES: Record<string, string> = {
  rose: 'from-rose-200 to-rose-100',
  sand: 'from-cream-300 to-cream-200',
  sage: 'from-sage-200 to-cream-200',
};

/* -------------------------------------------------------------------------- */
/*  Cards                                                                      */
/* -------------------------------------------------------------------------- */

const Cover = ({ tone, label, tall = false }: { tone: string; label: string; tall?: boolean }) => (
  <div
    className={cn(
      'relative w-full overflow-hidden rounded-2xl bg-gradient-to-br',
      COVER_TONES[tone] ?? COVER_TONES.rose,
      tall ? 'aspect-[16/10]' : 'aspect-[4/3]',
    )}
  >
    {/* Concentric ultrasound arcs — a quiet stand-in for photography. */}
    <svg
      aria-hidden
      viewBox="0 0 200 150"
      className="absolute inset-0 size-full text-ink-900/12"
      preserveAspectRatio="xMidYMid slice"
    >
      {[26, 44, 62, 80].map((r) => (
        <circle key={r} cx="150" cy="130" r={r} fill="none" stroke="currentColor" strokeWidth="0.8" />
      ))}
    </svg>
    <span className="label absolute bottom-4 left-4 rounded-full bg-cream-50/85 px-3 py-1.5 text-ink-700">
      {label}
    </span>
  </div>
);

/* `AnimatePresence mode="popLayout"` measures each child through a ref, so this
   has to forward one or the exit animation cannot be positioned. */
const PostCard = forwardRef<
  HTMLDivElement,
  { post: PostSummary; index: number; onOpen: (slug: string) => void }
>(({ post, index, onOpen }, ref) => (
  <motion.article
    ref={ref}
    layout
    initial={{ opacity: 0, y: 28 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.6, ease: EASE, delay: Math.min(index * 0.07, 0.35) }}
  >
    <button
      type="button"
      onClick={() => onOpen(post.slug)}
      className="group flex h-full w-full flex-col text-left"
    >
      <div className="overflow-hidden rounded-2xl">
        <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.8, ease: EASE }}>
          <Cover tone={post.cover.tone} label={post.cover.label} />
        </motion.div>
      </div>

      <div className="flex items-center gap-3 pt-5">
        <span className="label text-rose-500">{post.category}</span>
        <span className="size-1 rounded-full bg-ink-900/20" />
        <span className="label text-ink-400">{post.readingMinutes} min read</span>
      </div>

      <h3 className="mt-3 font-display text-[1.45rem] leading-tight text-ink-900 transition-colors duration-300 group-hover:text-rose-600">
        {post.title}
      </h3>
      <p className="mt-3 flex-1 text-[0.875rem] leading-relaxed text-slate-body">{post.excerpt}</p>
      <p className="label mt-5 text-ink-400">{formatDate(post.publishedAt)}</p>
    </button>
  </motion.article>
));
PostCard.displayName = 'PostCard';

/* -------------------------------------------------------------------------- */
/*  Reader overlay                                                             */
/* -------------------------------------------------------------------------- */

const Reader = ({ slug, onClose }: { slug: string; onClose: () => void }) => {
  // Articles ship with the bundle, so there is nothing to await — a missing
  // slug is the only failure case left.
  const post = useMemo(() => getPost(slug) ?? null, [slug]);
  const error = post ? null : 'That article could not be found.';

  useEffect(() => {
    lockScroll(true);
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      data-lenis-prevent
      className="fixed inset-0 z-[70] overflow-y-auto bg-page"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.5, ease: EASE }}
      role="dialog"
      aria-modal="true"
      aria-label={post?.title ?? 'Article'}
    >
      <div className="sticky top-0 z-10 border-b border-ink-900/10 bg-cream-100/90 backdrop-blur">
        <div className="shell flex items-center justify-between py-4">
          <button
            type="button"
            onClick={onClose}
            className="group flex items-center gap-2.5 text-sm text-ink-700"
          >
            <span className="grid size-9 place-items-center rounded-full border border-ink-900/15 transition-colors duration-300 group-hover:bg-ink-900 group-hover:text-cream-100">
              <svg viewBox="0 0 16 16" aria-hidden className="size-3.5">
                <path
                  d="M13 8H3M7 4L3 8l4 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            Back to the journal
          </button>
          {post && <span className="label text-ink-400">{post.readingMinutes} min read</span>}
        </div>
      </div>

      <div className="shell py-14 md:py-20">
        {error && (
          <p role="alert" className="mx-auto max-w-2xl text-center text-slate-body">
            {error}
          </p>
        )}

        {post && (
          <article className="mx-auto max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="label text-rose-500">{post.category}</span>
              <span className="size-1 rounded-full bg-ink-900/20" />
              <span className="label text-ink-400">{formatDate(post.publishedAt)}</span>
            </div>

            <h1 className="mt-5 font-display text-[2.25rem] leading-[1.05] text-ink-900 md:text-[3rem]">
              {post.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-body">{post.excerpt}</p>

            <div className="mt-10">
              <Cover tone={post.cover.tone} label={post.cover.label} tall />
            </div>

            <div className="mt-12 space-y-7">
              {post.body.map((block, i) => {
                if (block.type === 'heading') {
                  return (
                    <h2 key={i} className="pt-4 font-display text-[1.75rem] leading-tight text-ink-900">
                      {block.text}
                    </h2>
                  );
                }
                if (block.type === 'list') {
                  return (
                    <ul key={i} className="space-y-3">
                      {block.items.map((item) => (
                        <li key={item} className="flex gap-3.5 text-[0.975rem] leading-relaxed text-slate-body">
                          <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-rose-300" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (block.type === 'callout') {
                  return (
                    <aside
                      key={i}
                      className="rounded-2xl border-l-2 border-rose-300 bg-rose-50 px-6 py-5"
                    >
                      <p className="font-display text-lg leading-snug text-ink-800">
                        {block.text}
                      </p>
                    </aside>
                  );
                }
                return (
                  <p key={i} className="text-[0.975rem] leading-[1.75] text-slate-body">
                    {block.text}
                  </p>
                );
              })}
            </div>

            <footer className="mt-14 rounded-2xl bg-ink-900 p-8 text-cream-100">
              <p className="font-display text-2xl leading-snug text-cream-50">
                Questions this raised for your pregnancy?
              </p>
              <p className="mt-3 text-sm leading-relaxed text-cream-100/60">
                General information is no substitute for someone looking at your scan. Book a
                consultation and bring this article with you.
              </p>
              <BookCta />
            </footer>
          </article>
        )}
      </div>
    </motion.div>
  );
};

const BookCta = () => {
  const { open } = useBooking();
  return (
    <Button variant="onDark" size="md" className="mt-6" onClick={() => open()}>
      Book an appointment
    </Button>
  );
};

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState('all');

  const openSlug = searchParams.get('post');

  const posts = useMemo(() => listPosts(), []);

  const categories = useMemo(
    () => ['all', ...new Set(posts.map((post) => post.category))],
    [posts],
  );

  const visible = useMemo(
    () => (category === 'all' ? posts : posts.filter((post) => post.category === category)),
    [posts, category],
  );

  const featured = posts.find((post) => post.featured) ?? posts[0];
  const rest = visible.filter((post) => post.slug !== featured?.slug || category !== 'all');

  const openPost = useCallback(
    (slug: string) => setSearchParams({ post: slug }, { replace: false }),
    [setSearchParams],
  );
  const closePost = useCallback(() => setSearchParams({}, { replace: false }), [setSearchParams]);

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="relative flex min-h-svh items-center overflow-hidden pb-20 pt-28 md:pt-32">
        <div className="shell relative z-10 text-center">
          <Eyebrow className="justify-center">Journal</Eyebrow>
          <SplitWords
            as="h1"
            immediate
            delay={0.1}
            words={[
              { text: 'A' },
              { text: 'quiet' },
              { text: 'place' },
              { text: 'to' },
              { text: 'read', accent: true },
              { text: 'up.' },
            ]}
            className="display-xl mx-auto mt-6 max-w-[16ch] text-ink-900"
          />
          <motion.p
            className="mx-auto mt-7 max-w-[54ch] text-base leading-relaxed text-slate-body"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
          >
            Notes from the clinic on prenatal screening, scan findings and the questions families
            ask most. Written to be understood — not to replace a consultation.
          </motion.p>
        </div>
      </section>

      <div className="border-y border-ink-900/10 bg-ink-900 py-4">
        <Marquee duration={54}>
          {['Evidence-based', 'Plain language', 'Reviewed by Dr. Divya', 'Updated regularly'].map(
            (item) => (
              <span key={item} className="flex shrink-0 items-center gap-8 px-8">
                <span className="label whitespace-nowrap text-cream-100/70">{item}</span>
                <span className="size-1.5 shrink-0 rounded-full bg-rose-300" />
              </span>
            ),
          )}
        </Marquee>
      </div>

      {/* ------------------------------------------------------- featured */}
      <section className="py-16 md:py-24">
        <div className="shell">
          {featured && category === 'all' && (
            <motion.button
              type="button"
              onClick={() => openPost(featured.slug)}
              className="group grid w-full gap-8 text-left md:grid-cols-2 md:items-center md:gap-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <div className="overflow-hidden rounded-2xl">
                <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.9, ease: EASE }}>
                  <Cover tone={featured.cover.tone} label={featured.cover.label} tall />
                </motion.div>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="label rounded-full bg-ink-900 px-3 py-1.5 text-cream-100">
                    Featured
                  </span>
                  <span className="label text-ink-400">{featured.readingMinutes} min read</span>
                </div>
                <h2 className="mt-5 font-display text-[2rem] leading-[1.08] text-ink-900 transition-colors duration-300 group-hover:text-rose-600 md:text-[2.75rem]">
                  {featured.title}
                </h2>
                <p className="mt-5 max-w-[48ch] text-[0.95rem] leading-relaxed text-slate-body">
                  {featured.excerpt}
                </p>
                <span className="link-wipe mt-7 inline-block text-sm text-ink-900">
                  Read the article
                </span>
              </div>
            </motion.button>
          )}
        </div>
      </section>

      {/* ----------------------------------------------------------- grid */}
      <section className="py-16 md:py-24">
        <div className="shell">
          <div className="flex flex-wrap items-center justify-between gap-6 border-b border-ink-900/10 pb-6">
            <h2 className="font-display text-2xl text-ink-900">All articles</h2>
            <div className="no-scrollbar -mx-1 flex max-w-full gap-1.5 overflow-x-auto px-1">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  aria-pressed={category === item}
                  className={cn(
                    'label relative shrink-0 rounded-full px-4 py-2.5 transition-colors duration-300',
                    category === item ? 'text-cream-100' : 'text-ink-600 hover:text-ink-900',
                  )}
                >
                  {category === item && (
                    <motion.span
                      layoutId="category-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-ink-900"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  {item === 'all' ? 'Everything' : item}
                </button>
              ))}
            </div>
          </div>

          <motion.div layout className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {rest.map((post, index) => (
                <PostCard key={post.slug} post={post} index={index} onOpen={openPost} />
              ))}
            </AnimatePresence>
          </motion.div>

          {rest.length === 0 && (
            <p className="py-20 text-center text-slate-body">
              Nothing filed under this topic yet — check back soon.
            </p>
          )}
        </div>
      </section>

      <AnimatePresence>
        {openSlug && <Reader key={openSlug} slug={openSlug} onClose={closePost} />}
      </AnimatePresence>
    </>
  );
};
