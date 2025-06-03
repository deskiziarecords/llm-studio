import React from 'react';
import { motion } from 'framer-motion';

export const VoiceVisualizer: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-primary-500 rounded-full"
          animate={{
            height: [
              '20%',
              `${Math.random() * 60 + 40}%`,
              '20%'
            ]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut'
          }}
        />
      ))}
      <span className="ml-2 text-sm text-gray-300">Listening...</span>
    </div>
  );
};