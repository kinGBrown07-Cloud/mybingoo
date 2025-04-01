export const THEMES = {
  KIT_ALIMENTAIRE: {
    id: 'kit-alimentaire',
    name: 'Kit Alimentaire',
    description: 'Gagnez des kits alimentaires complets',
    image: '/images/themes/kit-alimentaire.png',
    prizes: [
      'Riz',
      'Huile',
      'Sucre',
      'Lait',
      'Café',
      'Thé',
      'Conserves',
      'Pâtes'
    ]
  },
  HABILLEMENT: {
    id: 'habillement',
    name: 'Habillement',
    description: 'Gagnez des vêtements et accessoires',
    image: '/images/themes/habillement.png',
    prizes: [
      'T-shirts',
      'Pantalons',
      'Robes',
      'Chaussures',
      'Sacs',
      'Accessoires',
      'Montres',
      'Bijoux'
    ]
  },
  SUPER_LOT: {
    id: 'super-lot',
    name: 'Super Lot',
    description: 'Gagnez des lots exceptionnels',
    image: '/images/themes/super-lot.png',
    prizes: [
      'Moto Scooter',
      'Smartphone',
      'Ordinateur Portable',
      'TV LED',
      'Console de Jeux',
      'Climatiseur',
      'Réfrigérateur',
      'Machine à Laver'
    ]
  }
} as const;

export type ThemeId = keyof typeof THEMES;
