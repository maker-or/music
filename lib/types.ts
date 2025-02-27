export interface SongResult {
  title: string;
  artist: string;
  album?: string;
  releaseDate: string;
  genre?: string;
  albumArt?: string;
  label?: string;
  lyrics?: string;
  isrc?: string;
}

export interface ShazamResponse {
  matches: {
    id: string;
    offset: number;
    timeskew: number;
    frequencyskew: number;
  }[];
  track: {
    layout: string;
    type: string;
    key: string;
    title: string;
    subtitle: string;
    images?: {
      background: string;
      coverart: string;
      coverarthq: string;
    };
    share?: {
      subject: string;
      text: string;
      href: string;
      image: string;
      twitter: string;
      html: string;
      avatar: string;
      snapchat: string;
    };
    hub?: {
      type: string;
      image: string;
      actions: {
        name: string;
        type: string;
        id?: string;
        uri?: string;
      }[];
      options: {
        caption: string;
        actions: {
          name: string;
          type: string;
          uri: string;
        }[];
        beacondata: {
          type: string;
          providername: string;
        };
        image: string;
        type: string;
        listcaption: string;
        overflowimage: string;
        colouroverflowimage: boolean;
        providername: string;
      }[];
      providers: {
        caption: string;
        images: {
          overflow: string;
          default: string;
        };
        actions: {
          name: string;
          type: string;
          uri: string;
        }[];
        type: string;
      }[];
    };
    sections?: {
      type: string;
      metapages?: {
        image: string;
        caption: string;
      }[];
      tabname: string;
      metadata?: {
        title: string;
        text: string;
      }[];
      text?: string[];
      footer?: string;
      beacondata?: {
        lyricsid: string;
        providername: string;
        commontrackid: string;
      };
    }[];
    url: string;
    artists?: {
      id: string;
      adamid: string;
    }[];
    isrc?: string;
    genres?: {
      primary: string;
    };
    urlparams?: {
      "{tracktitle}": string;
      "{trackartist}": string;
    };
    myshazam?: {
      apple: {
        actions: {
          name: string;
          type: string;
          uri: string;
        }[];
      };
    };
    albumadamid?: string;
    trackadamid?: string;
    releasedate?: string;
  };
  timestamp: number;
  timezone: string;
  tagid: string;
}