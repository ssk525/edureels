/**
 * Lightweight title scoring so we prefer explainer-style clips over noise.
 * Topic-aware boosts keep “Papers” from filling with generic AI intros.
 */
const BOOST = [
  'explain',
  'explained',
  'tutorial',
  'intro',
  'introduction',
  'what is',
  'how does',
  'basics',
  'learn',
  'concept',
  'fundamentals',
  'crash course',
  'in 5 minutes',
  'in minutes',
];

const PENALIZE = [
  'official music',
  'music video',
  'trailer',
  'gameplay',
  'full movie',
  'asmr',
  'reaction',
  'vlog',
];

const TOPIC_BOOSTS: Record<string, string[]> = {
  papers: [
    'paper',
    'arxiv',
    'research paper',
    'paper explained',
    'paper review',
    'new paper',
    'attention is all',
    'transformer paper',
    'diffusion paper',
  ],
  ainews: ['news', 'update', 'announced', 'launch', 'released', 'today', 'this week'],
  models: ['gpt', 'claude', 'gemini', 'llama', 'model', 'release', 'announced', 'openai', 'anthropic'],
};

const TOPIC_REQUIRE: Record<string, string[]> = {
  // At least one of these should appear for Papers, or score collapses.
  papers: ['paper', 'arxiv', 'research', 'survey'],
};

export function educationalScore(title: string, topicId?: string): number {
  const text = title.toLowerCase();
  let score = 0;
  for (const term of BOOST) {
    if (text.includes(term)) score += 2;
  }
  for (const term of PENALIZE) {
    if (text.includes(term)) score -= 4;
  }

  const boosts = topicId ? TOPIC_BOOSTS[topicId] : undefined;
  if (boosts) {
    for (const term of boosts) {
      if (text.includes(term)) score += 6;
    }
  }

  const required = topicId ? TOPIC_REQUIRE[topicId] : undefined;
  if (required?.length) {
    const hit = required.some((term) => text.includes(term));
    if (!hit) score -= 20;
  }

  return score;
}

/** Stable sort: higher educational score first; equal scores keep relative order. */
export function rankEducational<T extends { title: string }>(
  items: T[],
  topicId?: string,
): T[] {
  return items
    .map((item, index) => ({
      item,
      index,
      score: educationalScore(item.title, topicId),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((entry) => entry.item);
}

/** Drop weak matches for strict topics (e.g. Papers without “paper” in title). */
export function filterForTopic<T extends { title: string }>(
  items: T[],
  topicId: string,
): T[] {
  const required = TOPIC_REQUIRE[topicId];
  if (!required?.length) return items;
  const matched = items.filter((item) => {
    const text = item.title.toLowerCase();
    return required.some((term) => text.includes(term));
  });
  // Keep filtered set when we have enough; otherwise keep ranked list so feed isn’t empty.
  return matched.length >= 3 ? matched : items;
}
