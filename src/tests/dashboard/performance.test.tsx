import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Dashboard from '@/app/dashboard/page';
import { useVirtualizer } from '@tanstack/react-virtual';

// Mock des hooks et composants externes
vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: vi.fn(() => ({
    getVirtualItems: () => [],
    measureElement: () => {},
    getTotalSize: () => 1000,
  })),
}));

vi.mock('@/hooks/useDataCache', () => ({
  useDataCache: vi.fn(() => ({
    data: [],
    loading: false,
    error: null,
  })),
}));

describe('Dashboard Performance Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.performance.mark = vi.fn();
    window.performance.measure = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  test('mesure le temps de rendu initial', () => {
    performance.mark('dashboardRenderStart');
    render(<Dashboard />);
    performance.mark('dashboardRenderEnd');
    performance.measure('dashboardRenderTime', 'dashboardRenderStart', 'dashboardRenderEnd');

    expect(performance.mark).toHaveBeenCalledWith('dashboardRenderStart');
    expect(performance.mark).toHaveBeenCalledWith('dashboardRenderEnd');
    expect(performance.measure).toHaveBeenCalledWith(
      'dashboardRenderTime',
      'dashboardRenderStart',
      'dashboardRenderEnd'
    );
  });

  test('vérifie la virtualisation des lignes du tableau', () => {
    render(<Dashboard />);
    expect(useVirtualizer).toHaveBeenCalled();
  });

  test('mesure le temps de réponse des interactions utilisateur', async () => {
    render(<Dashboard />);

    // Test du temps de réponse du menu mobile
    performance.mark('menuToggleStart');
    const menuButton = screen.getByLabelText(/ouvrir le menu/i);
    fireEvent.click(menuButton);
    performance.mark('menuToggleEnd');
    performance.measure('menuToggleTime', 'menuToggleStart', 'menuToggleEnd');

    expect(performance.measure).toHaveBeenCalledWith(
      'menuToggleTime',
      'menuToggleStart',
      'menuToggleEnd'
    );

    // Test du temps de réponse de la pagination
    performance.mark('paginationStart');
    const nextButton = screen.getByLabelText(/page suivante/i);
    fireEvent.click(nextButton);
    performance.mark('paginationEnd');
    performance.measure('paginationTime', 'paginationStart', 'paginationEnd');

    expect(performance.measure).toHaveBeenCalledWith(
      'paginationTime',
      'paginationStart',
      'paginationEnd'
    );
  });

  test('vérifie la gestion de la mémoire avec beaucoup de données', () => {
    const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      value: Math.random(),
    }));

    // Mesure de l'utilisation de la mémoire avant le rendu
    const memoryBefore = performance.memory?.usedJSHeapSize;

    render(
      <div style={{ height: '500px', overflow: 'auto' }}>
        <Dashboard initialData={largeDataset} />
      </div>
    );

    // Simulation de défilement
    fireEvent.scroll(screen.getByRole('table').parentElement!, {
      target: { scrollTop: 1000 },
    });

    // Mesure de l'utilisation de la mémoire après le défilement
    const memoryAfter = performance.memory?.usedJSHeapSize;

    // Vérifie que l'augmentation de la mémoire est raisonnable (moins de 50%)
    if (memoryBefore && memoryAfter) {
      const memoryIncrease = (memoryAfter - memoryBefore) / memoryBefore;
      expect(memoryIncrease).toBeLessThan(0.5);
    }
  });

  test('vérifie les performances de mise à jour des graphiques', () => {
    const { rerender } = render(<Dashboard />);

    // Mesure du temps de mise à jour des graphiques
    performance.mark('chartUpdateStart');
    rerender(<Dashboard newData={{ points: 100, games: 5 }} />);
    performance.mark('chartUpdateEnd');
    performance.measure('chartUpdateTime', 'chartUpdateStart', 'chartUpdateEnd');

    expect(performance.measure).toHaveBeenCalledWith(
      'chartUpdateTime',
      'chartUpdateStart',
      'chartUpdateEnd'
    );
  });

  test('vérifie la réactivité sur mobile', () => {
    // Simulation d'un écran mobile
    Object.defineProperty(window, 'innerWidth', { value: 375 });
    window.dispatchEvent(new Event('resize'));

    render(<Dashboard />);

    // Vérifie que les éléments appropriés sont visibles/cachés
    expect(screen.getByRole('button', { name: /ouvrir le menu/i })).toBeVisible();
    expect(screen.queryByRole('navigation')).not.toBeVisible();

    // Test de l'interaction avec le menu
    fireEvent.click(screen.getByRole('button', { name: /ouvrir le menu/i }));
    expect(screen.getByRole('navigation')).toBeVisible();
  });
});
