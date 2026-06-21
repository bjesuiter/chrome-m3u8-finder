export type M3u8Link = {
  url: string;
  title: string;
  metadata: {
    germanTitle: string;
    englishTitle: string;
    selectedLanguage: string;
    seasonNr: string;
    episodeNr: string;
  };
};

type MakeOptional<T> = {
  [P in keyof T]?: T[P];
};

export type M3u8LinkIncomplete = MakeOptional<M3u8Link>;
