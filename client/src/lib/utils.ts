type ClassValue = string | number | null | undefined | false | ClassValue[];

/** Minimal classnames joiner — we don't need tailwind-merge's conflict solving. */
export const cn = (...values: ClassValue[]): string => {
  const out: string[] = [];
  const walk = (value: ClassValue) => {
    if (!value && value !== 0) return;
    if (Array.isArray(value)) value.forEach(walk);
    else out.push(String(value));
  };
  values.forEach(walk);
  return out.join(' ');
};

export const formatDate = (iso: string): string =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

/** Today as `yyyy-mm-dd` in local time — used as the date input's `min`. */
export const todayIso = (): string => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
};

export const scrollToId = (hash: string) => {
  const id = hash.replace(/^\/?#/, '');
  const target = document.getElementById(id);
  if (!target) return false;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return true;
};
