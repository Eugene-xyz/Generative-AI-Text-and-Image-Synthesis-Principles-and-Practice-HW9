// Presentation choices only. Facts, dates and listening links remain in wiki/.
export const home = {
  band: 'band-qwer',
  members: ['member-chodan', 'member-magenta', 'member-hina', 'member-siyeon'],
  recommendations: ['recommendation-dear', 'recommendation-tbh', 'recommendation-dreamer'],
  releases: ['release-harmony-from-discord', 'release-manito', 'release-algorithms-blossom'],
  events: ['event-qwer-debut', 'event-show-champion-first-win', 'event-mama-awards-2024', 'event-rockation-seoul-2025'],
} as const;

export const categories: Record<string, string> = {
  'youth-introduction': '青春入門',
  'companionship-courage': '陪伴與勇氣',
  'band-story-creation': '樂團故事與創作',
  'more-musical-facets': '更多音樂面貌',
};
