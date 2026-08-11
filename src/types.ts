export type TopicId =
  | 'ml'
  | 'dl'
  | 'ai'
  | 'nn'
  | 'transformers'
  | 'cv'
  | 'nlp'
  | 'python'
  | 'datascience'
  | 'llm'
  | 'prompt'
  | 'maths'
  | 'ainews'
  | 'models'
  | 'papers';

/** Preferred spoken/written language for lesson discovery. */
export type ContentLanguage = 'en' | 'hi' | 'both';

export type VideoSource = 'api' | 'cache' | 'fallback';

export type EduVideo = {
  id: string;
  title: string;
  channelTitle: string;
  channelId: string;
  topicId: TopicId;
  topicLabel: string;
  thumbnail: string;
  durationSec: number;
};

export type FeedPage = {
  videos: EduVideo[];
  nextPageToken?: string;
};
