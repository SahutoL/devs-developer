# Dev Store

A simple, client-side web application for discovering and curating lists of your favorite App Store developers. Keep track of developers you follow and easily browse all the apps they've published.

This application is a Progressive Web App (PWA), which means it's installable on your device, works offline, and provides a native app-like experience.

## ✨ Features

*   **Add Developers:** Add developers to your list easily in two ways:
    *   **By App Search:** Search for any app on the App Store, and add its developer to your list.
    *   **By URL:** Paste a developer's or app's App Store page URL to add them directly.
*   **Developer Dashboard:** View all your saved developers in a clean, card-based layout.
*   **App Discovery:** Click on any developer to view a comprehensive list of all their published apps, fetched directly from the App Store.
*   **Detailed App View:** Select any app to open a detailed modal with screenshots, description, ratings, genre, and a direct link to the App Store page.
*   **Organization & Filtering:**
    *   **Tagging:** Assign custom tags to developers for easy categorization (e.g., "Game", "Productivity", "Indie").
    *   **Filtering:** Filter your developer list by tag to quickly find what you're looking for.
*   **Sorting:**
    *   Sort developers by name or the date they were added.
    *   Sort a developer's apps by name or release date.
*   **Data Management:**
    *   **Export:** Save your entire list of developers to a JSON file as a backup.
    *   **Import:** Restore your list from a previously exported JSON file.
*   **PWA Ready:** Installable on your home screen for an app-like experience with basic offline support.
*   **Responsive Design:** A clean, mobile-first interface that works on any device.

## 🚀 How to Use

1.  **Add a Developer:**
    *   Use the **"アプリ名で検索"** (Search by App Name) tab, type the name of an app, and click **"追加"** (Add) next to the developer you want to save.
    *   Alternatively, use the **"URLで追加"** (Add by URL) tab, paste the URL of an App Store developer or app page, and click **"追加"** (Add).
2.  **Manage Your List:**
    *   Your saved developers will appear in the **"保存した開発者"** (Saved Developers) section.
    *   Hover over a developer card to find icons for editing tags (🏷️) or deleting (🗑️).
    *   Use the filter buttons above the list to view developers with a specific tag.
    *   Use the sort buttons to reorder the list by name or date.
3.  **Explore Apps:**
    *   Click on any developer card to navigate to their app list.
    *   Click on any app in the list to see its full details.
4.  **Import/Export Data:**
    *   Click the upload (⬆️) and download (⬇️) icons at the top of the developer list to import or export your data as a `.json` file.

## 🛠️ Tech Stack

*   **Frontend:** [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Data Fetching:** iTunes Search API (via a CORS proxy)
*   **State Management:** React Hooks (`useState`, `useEffect`, `useCallback`, etc.)
*   **Local Persistence:** `localStorage` is used to save the developer list in the browser.
*   **Offline Support:** A Service Worker provides basic caching for offline use.

## 📁 Project Structure

```
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── common/         # Reusable components (Cards, Headers, etc.)
│   │   ├── icons/          # SVG icon components
│   │   ├── AppDetailModal.tsx
│   │   ├── AppList.tsx
│   │   ├── DeveloperList.tsx
│   │   └── DeveloperTagEditModal.tsx
│   ├── hooks/              # Custom React hooks (useDebounce, useLocalStorage)
│   ├── services/           # API service for iTunes
│   ├── types.ts            # TypeScript type definitions
│   ├── App.tsx             # Main application component
│   └── index.tsx           # Entry point
├── index.html
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker script
└── ...
```
