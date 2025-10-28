export interface Developer {
  id: number;
  name: string;
  url: string;
  dateAdded: string;
  iconUrl: string;
  tags?: string[];
}

export interface AppInfo {
  trackId: number;
  trackName: string;
  artworkUrl100: string;
  artworkUrl512: string;
  trackViewUrl: string;
  formattedPrice: string;
  genres: string[];
  description: string;
  averageUserRatingForCurrentVersion?: number;
  userRatingCount?: number;
  releaseDate: string;
  artistViewUrl: string;
  screenshotUrls: string[];
  // FIX: Add artistId and artistName to match the data structure from the iTunes API.
  artistId: number;
  artistName: string;
}

export interface ITunesLookupResult {
  resultCount: number;
  results: (ITunesAppResult | ITunesArtistResult)[];
}

export interface ITunesArtistResult {
    wrapperType: 'artist';
    artistType: string;
    artistName: string;
    artistLinkUrl: string;
    artistId: number;
    primaryGenreName: string;
    primaryGenreId: number;
}

export interface ITunesAppResult {
    wrapperType: 'software';
    trackId: number;
    trackName: string;
    artistId: number;
    artistName: string;
    artworkUrl100: string;
    artworkUrl512: string;
    trackViewUrl: string;
    formattedPrice: string;
    genres: string[];
    description: string;
    averageUserRatingForCurrentVersion?: number;
    userRatingCount?: number;
    releaseDate: string;
    artistViewUrl: string;
    screenshotUrls: string[];
}