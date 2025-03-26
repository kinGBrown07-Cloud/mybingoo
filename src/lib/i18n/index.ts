import { createI18n } from 'next-international';

export type Language = 'fr' | 'en';

type Translations = {
  common: {
    play: string;
    points: string;
    level: string;
    gamesPlayed: string;
    nextLevel: string;
    loading: string;
    error: string;
    success: string;
  };
  game: {
    win: string;
    lose: string;
    tryAgain: string;
    insufficientPoints: string;
    dailyLimitReached: string;
  };
  auth: {
    login: string;
    register: string;
    logout: string;
    forgotPassword: string;
  };
  prizes: {
    categories: {
      food: string;
      clothing: string;
      super: string;
    };
    claim: string;
    remaining: string;
  };
}

const frTranslations = {
  common: {
    play: 'Jouer',
    points: 'points',
    level: 'Niveau',
    gamesPlayed: 'Parties jouées',
    nextLevel: 'Prochain niveau',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
  },
  game: {
    win: 'Félicitations ! Vous avez gagné !',
    lose: 'Dommage ! Essayez encore !',
    tryAgain: 'Réessayer',
    insufficientPoints: 'Points insuffisants',
    dailyLimitReached: 'Limite quotidienne atteinte',
  },
  auth: {
    login: 'Connexion',
    register: 'Inscription',
    logout: 'Déconnexion',
    forgotPassword: 'Mot de passe oublié',
  },
  prizes: {
    categories: {
      food: 'Alimentation',
      clothing: 'Vêtements',
      super: 'Super lots',
    },
    claim: 'Réclamer',
    remaining: 'Restant',
  },
} as const;

const enTranslations = {
  common: {
    play: 'Play',
    points: 'points',
    level: 'Level',
    gamesPlayed: 'Games played',
    nextLevel: 'Next level',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
  },
  game: {
    win: 'Congratulations! You won!',
    lose: 'Too bad! Try again!',
    tryAgain: 'Try again',
    insufficientPoints: 'Insufficient points',
    dailyLimitReached: 'Daily limit reached',
  },
  auth: {
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    forgotPassword: 'Forgot password',
  },
  prizes: {
    categories: {
      food: 'Food',
      clothing: 'Clothing',
      super: 'Super prizes',
    },
    claim: 'Claim',
    remaining: 'Remaining',
  },
} as const;

export const { useI18n, I18nProvider } = createI18n({
  fr: () => Promise.resolve(frTranslations),
  en: () => Promise.resolve(enTranslations),
});

export const defaultLanguage: Language = 'fr';