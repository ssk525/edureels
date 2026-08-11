# FLOW

> How execution travels between files. Update when you change the load or play path.
> Current focus: MVP feed load → swipe → play → paginate.

## Boot path

```
index.ts
  └─ registerRootComponent(App)
       └─ App.tsx
            └─ FeedScreen
                 ├─ useKeepAwake()
                 └─ useVideoFeed()   ← data + pagination state
```

## Data load path (topic open / change)

```
FeedScreen mount
  → useVideoFeed
       0. readLastTopicId()                [services/preferences.ts]
          restore topic chip before first fetch
  → setTopicId / loadTopic()
       1. clear videos, reset page token
       2. readFeedCache(topicId)           [services/cache.ts]
            HIT  → set videos, source='cache', stop
            MISS → continue
       3. if !HAS_API_KEY
            → fallbackFor(topic)           [data/fallbackVideos.ts]
            → source='fallback'
       4. fetchEducationalVideos(topic)    [services/youtube.ts]
            a. search.list  (quota ~100)
            b. videos.list  (quota ~1)
            c. mapVideo filter ≤240s + embeddable
            d. rankEducational(titles)     [utils/educationalScore.ts]
       5. addQuotaUsage(units)             [services/quota.ts]
       6. writeFeedCache(...)
       7. on error → fallback + error banner
  Topic chip press → setTopicId → writeLastTopicId + reload
```

## UI / swipe path

```
FeedScreen
  PagerView (vertical)
    onPageSelected(position)
      → useVideoFeed.onPageSelected(index)
           setActiveIndex
           if near end (length - LOAD_MORE_THRESHOLD) → loadMore()
    each page:
      ReelCard(video, index, activeIndex)
        if |index - activeIndex| ≤ PREFETCH_WINDOW
          → YoutubePlayer (play only if active && !paused)
        else
          → thumbnail Image
        Pressable → toggle pause
        on ENDED → FeedScreen.goTo(index + 1)
```

## Pagination path

```
onPageSelected near end
  → loadMore()
       guard: has key, source≠fallback, has nextPageToken, not already fetching
       fetchEducationalVideos(topic, nextPageToken)
       dedupe merge into videos
       writeFeedCache
```

## Files by responsibility

| File | Role in the flow |
| --- | --- |
| `App.tsx` | Root shell + StatusBar |
| `FeedScreen.tsx` | Pager + chrome (brand, chips, banners) |
| `ReelCard.tsx` | Player mount policy + pause + end |
| `ReelOverlay.tsx` | Title / channel / pause glyph |
| `TopicChips.tsx` | Topic selection UI |
| `useVideoFeed.ts` | State machine for feed |
| `youtube.ts` | Network + filter + educational rank |
| `cache.ts` / `quota.ts` / `preferences.ts` | Persistence |
| `educationalScore.ts` | Title ranking (no extra API cost) |
| `env.ts` / `topics.ts` | Config |

## Modifying right now

Document the path segment you are changing before you edit, e.g.:

> Changing: pagination near-end trigger in `useVideoFeed.onPageSelected`
> Touches: `LOAD_MORE_THRESHOLD`, `loadMore`, `FeedScreen` banner only if UX changes
