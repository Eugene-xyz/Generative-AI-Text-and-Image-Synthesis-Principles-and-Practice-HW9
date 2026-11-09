export interface MemberPhoto {
  path: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  author: string;
  source: string;
  original: string;
  license: string;
  licenseUrl: string;
  modification: string;
}

const showcase = {
  caption: '2024 SHOWCASE / 2024.04.01',
  author: 'K-POPIT 케이팝잇',
  original: 'https://www.youtube.com/watch?v=zdU5Z-muWbA',
  license: 'CC BY 3.0',
  licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
  modification: '影片截圖，本站未修改',
};

// User selected all four B candidates. These are original Commons screenshots.
export const memberPhotos: Partial<Record<string, MemberPhoto>> = {
  'member-chodan': {
    ...showcase, path: 'images/chodan-showcase-2024.png', width: 575, height: 720,
    alt: 'Chodan 在 2024 年 Showcase 穿深色制服外套，雙手在臉旁比出手勢。',
    source: 'https://commons.wikimedia.org/wiki/File:QWER_Chodan_(%EC%B5%B8%EB%8B%A8)_07.png',
  },
  'member-magenta': {
    ...showcase, path: 'images/magenta-showcase-2024.png', width: 594, height: 832,
    alt: 'Magenta 在 2024 年 Showcase 穿白色制服上衣，在下巴前比出 W 手勢。',
    source: 'https://commons.wikimedia.org/wiki/File:QWER_Magenta_(%EB%A7%88%EC%A0%A0%ED%83%80).png',
  },
  'member-hina': {
    ...showcase, path: 'images/hina-showcase-2024.png', width: 495, height: 574,
    alt: 'Hina 在 2024 年 Showcase 穿深色針織上衣，正面微笑並在臉旁比出手勢。',
    source: 'https://commons.wikimedia.org/wiki/File:QWER_Hina_(%ED%9E%88%EB%82%98)_04.png',
  },
  'member-siyeon': {
    ...showcase, path: 'images/siyeon-showcase-2024.png', width: 489, height: 556,
    alt: 'Siyeon 在 2024 年 Showcase 穿粉色外套，微笑並在臉旁比出手勢。',
    source: 'https://commons.wikimedia.org/wiki/File:QWER_Lee_Siyeon_(%EC%9D%B4%EC%8B%9C%EC%97%B0)_01.png',
  },
};
