import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const HyperText = ({ children, className }) => {
  const [text, setText] = useState(children);
  const intervalRef = useRef(null);

  const triggerAnimation = () => {
    let iteration = 0;
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setText((prev) =>
        children
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return children[index];
            }
            return alphabets[Math.floor(Math.random() * 26)];
          })
          .join("")
      );

      if (iteration >= children.length) {
        clearInterval(intervalRef.current);
      }

      iteration += 1 / 3;
    }, 30);
  };

  return (
    <motion.span
      className={className}
      onMouseEnter={triggerAnimation}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{ display: "inline-block" }}
    >
      {text}
    </motion.span>
  );
};
