import type { LinkInfo } from './components/Link';

const removeTrailingSlash = (path: string) =>
  path.endsWith('/') ? path.slice(0, -1) : path;

export type Lang = 'zh' | 'en';

export function getLang(): Lang {
  if (typeof window === 'undefined') {
    return 'en';
  }
  const { location } = window;
  const langPrefix =
    location.pathname === '/' ? '' : removeTrailingSlash(location.pathname);
  return langPrefix.includes('zh') ? 'zh' : 'en';
}

export type NavConfig = Array<{
  title: string;
  titleEn: string;
  links: LinkInfo[];
}>;
