import { render, screen } from '@testing-library/react';
import GameProgress from '../components/GameProgress';

describe('GameProgress', () => {
  const defaultProps = {
    currentPoints: 50,
    targetPoints: 100,
    level: 2,
    gamesPlayed: 10,
  };

  it('renders correctly with default props', () => {
    render(<GameProgress {...defaultProps} />);
    
    expect(screen.getByText('Niveau 2')).toBeInTheDocument();
    expect(screen.getByText('50 / 100 points')).toBeInTheDocument();
    expect(screen.getByText('Parties jouées')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('calculates remaining points correctly', () => {
    render(<GameProgress {...defaultProps} />);
    expect(screen.getByText('50 points')).toBeInTheDocument(); // 100 - 50 = 50 points remaining
  });

  it('caps progress at 100%', () => {
    render(
      <GameProgress
        {...defaultProps}
        currentPoints={150}
        targetPoints={100}
      />
    );
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle({ width: '100%' });
  });
}); 