import { Router } from 'express';
import type { Post, PostSummary } from '@drdivya/shared';
import { getPost, listCategories, listPosts } from '../data/posts.js';
import { HttpError, asyncHandler } from '../middleware/error.js';
import { readLimiter } from '../middleware/rateLimit.js';

export const postsRouter = Router();

postsRouter.use(readLimiter);

postsRouter.get(
  '/categories',
  asyncHandler((_req, res) => {
    res.json({ ok: true, data: listCategories() });
  }),
);

postsRouter.get(
  '/',
  asyncHandler((req, res) => {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const data: PostSummary[] = listPosts(category === 'all' ? undefined : category);
    res.json({ ok: true, data });
  }),
);

postsRouter.get(
  '/:slug',
  asyncHandler((req, res) => {
    const post: Post | undefined = getPost(req.params.slug ?? '');
    if (!post) throw new HttpError(404, 'post_not_found', 'That article could not be found.');
    res.json({ ok: true, data: post });
  }),
);
