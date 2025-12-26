import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const Preloader = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("INITIALIZING");

  useEffect(() => {
    // Randomize loading speed
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const jump = Math.floor(Math.random() * 5) + 1;
        return Math.min(prev + jump, 100);
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (count > 30) setText("LOADING ASSETS");
    if (count > 60) setText("ESTABLISHING UPLINK");
    if (count > 90) setText("READY");
    
    if (count === 100) {
      setTimeout(() => {
        onComplete();
      }, 800);
    }
  }, [count, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white overflow-hidden"
      initial={{ y: 0 }}
      exit={{ 
        y: "-100%", 
        transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } 
      }}
    >
      {/* Background Grid Effect */}
      <div className="absolute inset-0 opacity-10" 
           style={{ 
             backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }} 
      />

      <div className="relative z-10 flex flex-col items-center">
        <motion.div 
          className="text-8xl md:text-9xl font-bold font-['JetBrains_Mono'] tracking-tighter"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {count}%
        </motion.div>
        
        <motion.div 
          className="mt-4 text-sm md:text-base font-['JetBrains_Mono'] text-gray-400 tracking-widest"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.div>

        {/* Progress Bar */}
        <div className="mt-8 w-64 h-[2px] bg-gray-800 relative overflow-hidden">
            <motion.div 
                className="absolute top-0 left-0 h-full bg-white"
                initial={{ width: "0%" }}
                animate={{ width: `${count}%` }}
            />
        </div>
      </div>
    </motion.div>
  );
};
