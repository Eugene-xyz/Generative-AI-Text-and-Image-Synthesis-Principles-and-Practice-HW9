export interface MusicEmbed {
  url: string;
  source: string;
  checkedAt: string;
}

// Display assets only. Track facts, dates and version descriptions stay in Wiki.
// Add only the Spotify album widget checked against this exact release.
const checkedAlbums: Record<string, string> = {
  'release-harmony-from-discord': '0AmeepTU81c9ghVpJpacNc',
  'release-discord-tak-remix': '52wHoxgw9rL3uRO4nJvaXL',
  'release-manito': '58749dw7F011CU9lRmX0MO',
  'release-fake-idol': '6it990sp2jw29IlDjFpO26',
  'release-algorithms-blossom': '4i0rZXe1lgKDzJ8LkueifT',
  'release-discord-japanese': '5FOQ5cbUbJZ4U2Qn5o0yZG',
  'release-in-a-million-noises': '1kOSueM1uqixinJjvk6ivV',
  'release-blue-whale': '4J4HRHJCwGHHutsosHWA3J',
  'release-ceremony': '22TsuaiFzj7i9cIKFwKdyI',
  'release-show-down': '0utXaTMHxah2lKr3TBPF1i',
  'release-to-be-continued': '0qVLboIquXt3xdBG1VbhYa',
  'release-dreamer-picaresque': '24fHVsr25u2vA4V4rC1KSl',
};
export const musicEmbeds: Partial<Record<string, MusicEmbed>> = Object.fromEntries(
  Object.entries(checkedAlbums).map(([workId, albumId]) => [workId, {
    url: `https://open.spotify.com/embed/album/${albumId}`,
    source: `https://open.spotify.com/album/${albumId}`,
    checkedAt: '2026-11-09',
  }]),
);
