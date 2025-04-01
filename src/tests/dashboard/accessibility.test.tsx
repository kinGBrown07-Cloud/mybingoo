import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { vi } from 'vitest';
import Dashboard from '@/app/dashboard/page';

expect.extend(toHaveNoViolations);

// Mock des hooks et composants externes
vi.mock('@/hooks/useDataCache', () => ({
  useDataCache: vi.fn(() => ({
    data: [],
    loading: false,
    error: null,
  })),
}));

describe('Dashboard Accessibility Tests', () => {
  test('ne devrait avoir aucune violation d\'accessibilité', async () => {
    const { container } = render(<Dashboard />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('vérifie la navigation au clavier', () => {
    render(<Dashboard />);
    
    // Focus initial sur le bouton du menu
    const menuButton = screen.getByLabelText(/ouvrir le menu/i);
    menuButton.focus();
    expect(document.activeElement).toBe(menuButton);

    // Ouvrir le menu
    fireEvent.keyDown(menuButton, { key: 'Enter' });
    
    // Vérifier que le premier élément du menu est focusable
    const firstMenuItem = screen.getByRole('menuitem', { name: /tableau de bord/i });
    firstMenuItem.focus();
    expect(document.activeElement).toBe(firstMenuItem);

    // Navigation dans le menu avec les flèches
    fireEvent.keyDown(firstMenuItem, { key: 'ArrowDown' });
    const nextMenuItem = screen.getByRole('menuitem', { name: /statistiques/i });
    expect(document.activeElement).toBe(nextMenuItem);

    // Fermeture du menu avec Escape
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    expect(screen.queryByRole('navigation')).not.toBeVisible();
  });

  test('vérifie les attributs ARIA des composants', () => {
    render(<Dashboard />);

    // Navigation
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label');

    // Boutons de pagination
    const prevButton = screen.getByRole('button', { name: /page précédente/i });
    expect(prevButton).toHaveAttribute('aria-label');
    expect(prevButton).toHaveAttribute('aria-disabled', 'true');

    const nextButton = screen.getByRole('button', { name: /page suivante/i });
    expect(nextButton).toHaveAttribute('aria-label');

    // Tableaux
    const tables = screen.getAllByRole('table');
    tables.forEach(table => {
      expect(table).toHaveAttribute('aria-label');
      const headers = table.querySelectorAll('th');
      headers.forEach(header => {
        expect(header).toHaveAttribute('scope', 'col');
      });
    });

    // Graphiques
    const charts = screen.getAllByRole('img', { name: /graphique/i });
    charts.forEach(chart => {
      expect(chart).toHaveAttribute('aria-label');
      expect(chart).toHaveAttribute('role', 'img');
    });
  });

  test('vérifie le contraste des couleurs', () => {
    render(<Dashboard />);

    // Vérifier le contraste du texte sur fond blanc
    const textElements = screen.getAllByText(/.+/);
    textElements.forEach(element => {
      const styles = window.getComputedStyle(element);
      const backgroundColor = styles.backgroundColor;
      const color = styles.color;
      
      // Fonction simplifiée pour calculer le ratio de contraste
      const getLuminance = (r: number, g: number, b: number) => {
        const [rs, gs, bs] = [r, g, b].map(c => {
          c = c / 255;
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
      };

      const getRGB = (color: string) => {
        const match = color.match(/\d+/g);
        return match ? match.map(Number) : [0, 0, 0];
      };

      const [bgR, bgG, bgB] = getRGB(backgroundColor);
      const [txtR, txtG, txtB] = getRGB(color);

      const bgLuminance = getLuminance(bgR, bgG, bgB);
      const txtLuminance = getLuminance(txtR, txtG, txtB);

      const ratio = (Math.max(bgLuminance, txtLuminance) + 0.05) /
                   (Math.min(bgLuminance, txtLuminance) + 0.05);

      // Le ratio minimum recommandé est de 4.5:1 pour le texte normal
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });

  test('vérifie la gestion des lecteurs d\'écran', () => {
    render(<Dashboard />);

    // Vérifier que les images ont des alternatives textuelles
    const images = screen.getAllByRole('img');
    images.forEach(img => {
      expect(img).toHaveAttribute('alt');
    });

    // Vérifier que les icônes décoratives sont masquées
    const icons = document.querySelectorAll('[aria-hidden="true"]');
    expect(icons.length).toBeGreaterThan(0);

    // Vérifier l'ordre de lecture logique
    const landmarks = [
      screen.getByRole('banner'), // Header
      screen.getByRole('navigation'),
      screen.getByRole('main'),
    ];
    
    landmarks.forEach((landmark, index) => {
      if (index > 0) {
        expect(landmark.compareDocumentPosition(landmarks[index - 1]))
          .toBe(Node.DOCUMENT_POSITION_PRECEDING);
      }
    });
  });

  test('vérifie l\'accessibilité des formulaires', () => {
    render(<Dashboard />);

    // Vérifier les labels des champs de recherche
    const searchInputs = screen.getAllByRole('searchbox');
    searchInputs.forEach(input => {
      expect(input).toHaveAttribute('aria-label');
      const label = input.getAttribute('aria-label');
      expect(label).not.toBe('');
    });

    // Vérifier les messages d'erreur
    const errorMessages = screen.getAllByRole('alert');
    errorMessages.forEach(message => {
      expect(message).toHaveAttribute('role', 'alert');
      expect(message).toHaveAttribute('aria-live', 'assertive');
    });

    // Vérifier les champs obligatoires
    const requiredFields = document.querySelectorAll('[aria-required="true"]');
    requiredFields.forEach(field => {
      expect(field).toHaveAttribute('required');
    });
  });
});
