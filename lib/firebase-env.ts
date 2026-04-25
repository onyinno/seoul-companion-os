export type FirebasePublicConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  appId: string;
};

export type FirebaseEnvValidation = {
  enabled: boolean;
  config: FirebasePublicConfig | null;
  missingKeys: string[];
};

const FIREBASE_ENV_KEYS = {
  apiKey: 'NEXT_PUBLIC_FIREBASE_API_KEY',
  authDomain: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  projectId: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  storageBucket: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  appId: 'NEXT_PUBLIC_FIREBASE_APP_ID'
} as const;

export function getFirebaseEnvValidation(): FirebaseEnvValidation {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() ?? '';
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() ?? '';
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() ?? '';
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() ?? '';
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim() ?? '';

  const missingKeys = Object.entries({
    [FIREBASE_ENV_KEYS.apiKey]: apiKey,
    [FIREBASE_ENV_KEYS.authDomain]: authDomain,
    [FIREBASE_ENV_KEYS.projectId]: projectId,
    [FIREBASE_ENV_KEYS.storageBucket]: storageBucket,
    [FIREBASE_ENV_KEYS.appId]: appId
  })
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    return {
      enabled: false,
      config: null,
      missingKeys
    };
  }

  return {
    enabled: true,
    config: {
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      appId
    },
    missingKeys: []
  };
}
