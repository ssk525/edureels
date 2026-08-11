import AsyncStorage from '@react-native-async-storage/async-storage';

export type AiHeadline = {
  id: string;
  title: string;
  summary: string;
  source: string;
  published: string;
  link: string;
};

const CACHE_KEY = 'edu-reels:news:headlines:v1';
const CACHE_TTL_MS = 2 * 60 * 60 * 1000;

const FEEDS: { source: string; url: string }[] = [
  {
    source: 'TechCrunch AI',
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
  },
  {
    source: 'The Verge AI',
    url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
  },
  {
    source: 'MIT Tech Review',
    url: 'https://www.technologyreview.com/feed/topic/artificial-intelligence/',
  },
  {
    source: 'Google AI Blog',
    url: 'https://blog.google/technology/ai/rss/',
  },
];

function decodeXml(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function firstTag(block: string, names: string[]): string {
  for (const name of names) {
    const match = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'i'));
    if (match?.[1]) return decodeXml(match[1]);
  }
  return '';
}

function linkFromItem(block: string): string {
  const enclosed = firstTag(block, ['link']);
  if (enclosed.startsWith('http')) return enclosed;
  const href = block.match(/<link[^>]*href="([^"]+)"/i);
  return href?.[1] ?? '';
}

function parseFeed(xml: string, source: string): AiHeadline[] {
  const chunks = xml.split(/<item[\s>]/i).slice(1);
  const entries = chunks.length ? chunks : xml.split(/<entry[\s>]/i).slice(1);

  return entries
    .map((raw, index) => {
      const block = raw.split(/<\/item>|<\/entry>/i)[0] ?? raw;
      const title = firstTag(block, ['title']);
      const link = linkFromItem(block);
      const summary = firstTag(block, ['description', 'summary', 'content:encoded', 'content']);
      const published = firstTag(block, ['pubDate', 'published', 'updated', 'dc:date']);
      if (!title || !link) return null;
      return {
        id: `${source}-${index}-${link}`.slice(0, 180),
        title,
        summary: summary.slice(0, 220),
        source,
        published: published.slice(0, 32),
        link,
      } satisfies AiHeadline;
    })
    .filter((item): item is AiHeadline => Boolean(item));
}

function sortByDateDesc(items: AiHeadline[]): AiHeadline[] {
  return [...items].sort((a, b) => {
    const da = Date.parse(a.published) || 0;
    const db = Date.parse(b.published) || 0;
    return db - da;
  });
}

async function readCache(): Promise<AiHeadline[] | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { savedAt: number; items: AiHeadline[] };
    if (!parsed.items?.length) return null;
    if (Date.now() - parsed.savedAt > CACHE_TTL_MS) return null;
    return parsed.items;
  } catch {
    return null;
  }
}

async function writeCache(items: AiHeadline[]): Promise<void> {
  await AsyncStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ savedAt: Date.now(), items }),
  );
}

/** Aggregate free AI RSS feeds — no API key required. */
export async function fetchAiHeadlines(
  limit = 30,
  options?: { forceRefresh?: boolean },
): Promise<AiHeadline[]> {
  if (!options?.forceRefresh) {
    const cached = await readCache();
    if (cached?.length) return cached.slice(0, limit);
  }

  const results = await Promise.allSettled(
    FEEDS.map(async (feed) => {
      const response = await fetch(feed.url, {
        headers: { Accept: 'application/rss+xml, application/xml, text/xml, */*' },
      });
      if (!response.ok) throw new Error(`${feed.source} (${response.status})`);
      const xml = await response.text();
      return parseFeed(xml, feed.source);
    }),
  );

  const merged: AiHeadline[] = [];
  const seen = new Set<string>();
  for (const result of results) {
    if (result.status !== 'fulfilled') continue;
    for (const item of result.value) {
      const key = item.link.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(item);
    }
  }

  const sorted = sortByDateDesc(merged).slice(0, limit);
  if (sorted.length) await writeCache(sorted);
  return sorted;
}
