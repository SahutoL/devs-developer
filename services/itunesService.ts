import type { ITunesLookupResult, ITunesAppResult, ITunesArtistResult, AppInfo, Developer } from '../types';

// Use a more reliable proxy to avoid fetch failures and empty responses.
const PROXY_URL = 'https://corsproxy.io/?';
const API_BASE_URL = 'https://itunes.apple.com';

const handleApiResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        const errorText = await response.text().catch(() => 'Could not read error response.');
        console.error("Proxy/API Error:", errorText);
        throw new Error('APIリクエストに失敗しました。');
    }

    const responseText = await response.text();
    if (!responseText) {
        // Handle cases where the proxy returns a successful status but an empty body.
        throw new Error('APIから空の応答を受け取りました。');
    }

    try {
        return JSON.parse(responseText) as T;
    } catch (e) {
        console.error("JSON Parse Error:", e);
        console.error("Invalid JSON received:", responseText);
        throw new Error('APIからの応答の解析に失敗しました。');
    }
}

const fetchDataWithProxy = async <T>(apiUrl: string): Promise<T> => {
    let response: Response;
    try {
        const proxyApiUrl = `${PROXY_URL}${encodeURIComponent(apiUrl)}`;
        response = await fetch(proxyApiUrl);
    } catch (networkError) {
        console.error('Fetch Error:', networkError);
        throw new Error('ネットワークリクエストに失敗しました。インターネット接続を確認するか、後でもう一度お試しください。');
    }
    return handleApiResponse<T>(response);
};

export const getDeveloperInfoFromUrl = async (url: string): Promise<Omit<Developer, 'dateAdded' | 'tags'>> => {
  const match = url.match(/\/id(\d+)/);
  if (!match) {
    throw new Error('無効なApp Store URLです。IDが見つかりません。');
  }
  const id = match[1];

  const apiUrl = `${API_BASE_URL}/lookup?id=${id}&country=jp&entity=software`;
  const data = await fetchDataWithProxy<ITunesLookupResult>(apiUrl);

  if (data.resultCount === 0) {
    throw new Error('開発者またはアプリが見つかりませんでした。');
  }

  const firstResult = data.results[0];

  // Logic to handle both developer and app URLs, based on the first result from the lookup API.
  if (firstResult?.wrapperType === 'artist') {
    const artistResult = firstResult as ITunesArtistResult;
    const representativeApp = data.results.find(
      (r): r is ITunesAppResult => r.wrapperType === 'software'
    );
    return {
      id: artistResult.artistId,
      name: artistResult.artistName,
      url: artistResult.artistLinkUrl,
      iconUrl: representativeApp?.artworkUrl100 || '',
    };
  } else if (firstResult?.wrapperType === 'software') {
    const appResult = firstResult as ITunesAppResult;
    return {
      id: appResult.artistId,
      name: appResult.artistName,
      url: appResult.artistViewUrl,
      iconUrl: appResult.artworkUrl100,
    };
  } else {
    throw new Error('有効な開発者またはアプリ情報が見つかりませんでした。');
  }
};

export const searchAppsByName = async (term: string): Promise<ITunesAppResult[]> => {
  if (!term.trim()) {
    return [];
  }
  const apiUrl = `${API_BASE_URL}/search?term=${encodeURIComponent(term)}&country=jp&entity=software&limit=20`;

  // Removed the try/catch block to let errors propagate to the UI component.
  // This provides better feedback to the user than failing silently.
  const data = await fetchDataWithProxy<ITunesLookupResult>(apiUrl);
  return data.results.filter(
    (result): result is ITunesAppResult => result.wrapperType === 'software'
  );
};


export const getAppsByDeveloper = async (artistId: number): Promise<AppInfo[]> => {
  const apiUrl = `${API_BASE_URL}/lookup?id=${artistId}&country=jp&entity=software`;
  
  // Removed the try/catch block to let errors propagate to the UI.
  // An empty proxy response is an error, not a valid "no apps" state.
  const data = await fetchDataWithProxy<ITunesLookupResult>(apiUrl);

  const apps = data.results
    .filter((result): result is ITunesAppResult => result.wrapperType === 'software' && result.artistId === artistId)
    .map(app => ({
      ...app,
      artworkUrl512: app.artworkUrl100.replace('100x100', '512x512'),
    }));

  return apps;
};