interface ImportMetaEnv {
  // ... could include environment variables
  /** App Name */
  readonly VITE_APP_NAME: string
  /** Pusher */
  readonly VITE_PUSHER_APP_KEY: string
  readonly VITE_PUSHER_HOST: string
  readonly VITE_PUSHER_PORT: string
  readonly VITE_PUSHER_SCHEME: string
  readonly VITE_PUSHER_APP_CLUSTER: string
  /** Google ReCaptcha */
  readonly VITE_GOOGLE_RECAPTCHA_SITE_KEY: string
  readonly VITE_GOOGLE_RECAPTCHA_SECRET_SITE_KEY: string
  /** Theme Color */
  readonly VITE_THEME_COLOR_APP: string
}

export interface ImportMeta {
  readonly env: ImportMetaEnv
}
