import type { TopicId } from '../types';

export type Topic = {
  id: TopicId;
  label: string;
  query: string;
};

/** Topic chips map to focused YouTube search queries. */
export const TOPICS: Topic[] = [
  {
    id: 'ml',
    label: 'Machine Learning',
    query: 'machine learning explained tutorial',
  },
  {
    id: 'dl',
    label: 'Deep Learning',
    query: 'deep learning explained tutorial',
  },
  {
    id: 'ai',
    label: 'AI Concepts',
    query: 'artificial intelligence concepts explained',
  },
  {
    id: 'nn',
    label: 'Neural Nets',
    query: 'neural network explained tutorial',
  },
  {
    id: 'transformers',
    label: 'Transformers',
    query: 'transformer model attention explained',
  },
  {
    id: 'llm',
    label: 'LLMs',
    query: 'large language model LLM explained tutorial',
  },
  {
    id: 'prompt',
    label: 'Prompting',
    query: 'prompt engineering explained tutorial',
  },
  {
    id: 'cv',
    label: 'Computer Vision',
    query: 'computer vision deep learning explained',
  },
  {
    id: 'nlp',
    label: 'NLP',
    query: 'natural language processing explained tutorial',
  },
  {
    id: 'python',
    label: 'Python',
    query: 'python for machine learning explained short',
  },
  {
    id: 'datascience',
    label: 'Data Science',
    query: 'data science explained tutorial short',
  },
  {
    id: 'maths',
    label: 'AI Maths',
    query: 'linear algebra probability for machine learning explained',
  },
  {
    id: 'ainews',
    label: 'AI News',
    query: 'artificial intelligence news this week explained',
  },
  {
    id: 'models',
    label: 'New Models',
    query: 'new LLM model release explained GPT Claude Gemini Llama',
  },
  {
    id: 'papers',
    label: 'Papers',
    query: 'AI research paper explained arxiv paper review',
  },
];

export const DEFAULT_TOPIC = TOPICS[0];

export function getTopic(id: TopicId): Topic {
  return TOPICS.find((topic) => topic.id === id) ?? DEFAULT_TOPIC;
}
