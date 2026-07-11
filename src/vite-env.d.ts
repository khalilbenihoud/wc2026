/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Optional Unsplash "Access Key" (free — register an app at
   * https://unsplash.com/oauth/applications). Used to fetch a hero photo for
   * the champion on a tournament page. When absent, the champion section falls
   * back to its flag-led layout, so the app builds and runs without it.
   */
  readonly VITE_UNSPLASH_ACCESS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
