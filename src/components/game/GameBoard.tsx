import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Prize, CardStatus, GameConfig } from '@/types/game';
import GameCard from './GameCard';
import { useGameSounds } from '@/hooks/useGameSounds';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';

interface GameBoardProps {
  config: GameConfig;
  prizes: Prize[];
  onGameEnd: (won: boolean, prize?: Prize) => void;
}

export default function GameBoard({ config, prizes, onGameEnd }: GameBoardProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[][]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [remainingTries, setRemainingTries] = useState(config.maxTries);
  const { playSound, toggleMute, isMuted } = useGameSounds();

  // Initialiser le jeu
  useEffect(() => {
    const shuffledPrizes = [...Array(6).keys()].map((index) => ({
      id: `card-${index}`,
      prizeId: `prize-${index % 3}`,
      status: 'hidden' as CardStatus,
      image: `/images/prizes/${config.gameType.toLowerCase()}/image-${index % 3}.jpg`,
    }));
    const shuffledCards = [...shuffledPrizes, ...shuffledPrizes].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
  }, [config.gameType]);

  // Gérer la sélection des cartes
  const handleCardClick = (cardId: string) => {
    if (
      gameStatus !== 'playing' ||
      selectedCards.length >= 2 ||
      selectedCards.includes(cardId) ||
      matchedPairs.some((pair) => pair.includes(cardId))
    ) {
      return;
    }

    playSound('flip');

    const newSelectedCards = [...selectedCards, cardId];
    setSelectedCards(newSelectedCards);

    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, status: 'revealed' as CardStatus } : card
      )
    );

    if (newSelectedCards.length === 2) {
      setTimeout(() => {
        setCards((prevCards) => {
          const firstCard = prevCards.find((card) => card.id === newSelectedCards[0]);
          const secondCard = prevCards.find((card) => card.id === newSelectedCards[1]);

          if (firstCard && secondCard && firstCard.prizeId === secondCard.prizeId) {
            playSound('match');
            setMatchedPairs((prevPairs) => [...prevPairs, newSelectedCards]);
            setSelectedCards([]);

            if ([...matchedPairs, newSelectedCards].length === prevCards.length / 2) {
              playSound('win');
              setGameStatus('won');
              onGameEnd(true);
            }
          } else {
            setSelectedCards([]);
            setRemainingTries((prevTries) => {
              const newTries = prevTries - 1;
              if (newTries === 0) {
                setGameStatus('lost');
                playSound('lose');
                onGameEnd(false);
              }
              return newTries;
            });
            return prevCards.map((card) =>
              newSelectedCards.includes(card.id)
                ? { ...card, status: 'hidden' as CardStatus }
                : card
            );
          }
          return prevCards;
        });
      }, 1000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-semibold">Essais restants : {remainingTries}</div>
        <button
          onClick={toggleMute}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label={isMuted() ? 'Activer le son' : 'Désactiver le son'}
        >
          {isMuted() ? <HiVolumeOff className="w-6 h-6" /> : <HiVolumeUp className="w-6 h-6" />}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <GameCard
              card={card}
              onClick={() => handleCardClick(card.id)}
              disabled={gameStatus !== 'playing'}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
