import React from 'react';
import { motion } from 'framer-motion';

const techs = [
  "Laravel", "Vue.js", "React", "Three.js", "Tailwind CSS", 
  "Framer Motion", "Node.js", "MySQL", "TypeScript", "Astro", 
  "Docker", "Git", "Figma", "Blender"
];

export const TechMarquee = () => {
  return (
    <div className="relative flex overflow-hidden py-10 border-y border-white/5 bg-white/[0.02]">
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-[#080808] via-transparent to-[#080808]"></div>
      
      <motion.div 
        className="flex gap-16 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ 
          repeat: Infinity, 
          ease: "linear", 
          duration: 20 
        }}
      >
        {[...techs, ...techs].map((tech, index) => (
          <div key={index} className="flex items-center gap-4">
            <span className="text-4xl md:text-6xl font-serif italic text-white/20">
              {tech}
            </span>
            <span className="w-2 h-2 rounded-full bg-blue-500/50"></span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
