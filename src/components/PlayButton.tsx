import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface PlayButtonProps {
  disabled?: boolean;
  className?: string;
}

export default function PlayButton({ disabled = false, className = '' }: PlayButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href="/play" className={className}>
      <motion.button
        className="relative px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        disabled={disabled}
      >
        <motion.span
          className="absolute inset-0 bg-white rounded-full opacity-0"
          animate={{
            scale: isHovered ? 1.5 : 1,
            opacity: isHovered ? 0.1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
        <span className="relative z-10">Jouer maintenant</span>
        <motion.div
          className="absolute -right-2 -top-2 w-4 h-4 bg-white rounded-full"
          animate={{
            scale: isHovered ? 1.5 : 1,
            opacity: isHovered ? 0.5 : 0.2,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>
    </Link>
  );
} 