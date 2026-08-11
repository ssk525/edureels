export type ArxivPaper = {
  id: string;
  title: string;
  summary: string;
  authors: string[];
  published: string;
  link: string;
  category: string;
};

function decodeXml(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function tag(block: string, name: string): string {
  const match = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'i'));
  return match ? decodeXml(match[1]) : '';
}

function tags(block: string, name: string): string[] {
  const matches = [...block.matchAll(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'gi'))];
  return matches.map((m) => decodeXml(m[1])).filter(Boolean);
}

/**
 * Free arXiv Atom API — latest AI / ML research (no YouTube key needed).
 * https://info.arxiv.org/help/api/user-manual.html
 */
export async function fetchLatestAiPapers(limit = 15): Promise<ArxivPaper[]> {
  const query = encodeURIComponent('cat:cs.AI OR cat:cs.LG OR cat:cs.CL');
  const url =
    `https://export.arxiv.org/api/query?search_query=${query}` +
    `&sortBy=submittedDate&sortOrder=descending&max_results=${limit}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`arXiv request failed (${response.status})`);
  }
  const xml = await response.text();
  const entries = xml.split('<entry>').slice(1);

  return entries.map((entry, index) => {
    const idUrl = tag(entry, 'id');
    const id = idUrl.split('/abs/').pop() || `arxiv-${index}`;
    const linkMatch = entry.match(/<link[^>]*href="([^"]+)"[^>]*rel="alternate"/i);
    const categoryMatch = entry.match(/<category[^>]*term="([^"]+)"/i);
    return {
      id,
      title: tag(entry, 'title'),
      summary: tag(entry, 'summary').slice(0, 280),
      authors: tags(entry, 'name').slice(0, 4),
      published: tag(entry, 'published').slice(0, 10),
      link: linkMatch?.[1] || idUrl,
      category: categoryMatch?.[1] ?? 'cs.AI',
    };
  });
}
