
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const LoginAnimation = () => {
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    // Start the animation after a small delay
    const timer = setTimeout(() => {
      setAnimationStarted(true);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const bubbleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (custom: number) => ({
      scale: 1,
      opacity: 0.85,
      transition: {
        delay: custom * 0.2,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    hover: {
      scale: 1.1,
      opacity: 1,
      transition: {
        duration: 0.2
      }
    }
  };

  const logoVariants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { 
      scale: [1, 1.05, 1], 
      opacity: 1,
      transition: { 
        duration: 1.2,
        ease: "easeOut" 
      }
    }
  };

  const pulseAnimation = {
    scale: [1, 1.03, 1],
    boxShadow: [
      "0 0 0 0 rgba(79, 70, 229, 0.1)",
      "0 0 0 20px rgba(79, 70, 229, 0)",
      "0 0 0 0 rgba(79, 70, 229, 0)"
    ],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop" as const
    }
  };

  return (
    <div className="relative h-full flex items-center justify-center overflow-hidden">
      {/* Background gradient bubbles */}
      <motion.div
        className="absolute inset-0 z-0"
        variants={containerVariants}
        initial="hidden"
        animate={animationStarted ? "visible" : "hidden"}
      >
        {/* Decorative background elements */}
        <motion.div
          variants={bubbleVariants}
          custom={0}
          className="absolute top-10 left-20 w-64 h-64 rounded-full bg-blue-300 opacity-10 blur-xl"
          whileHover="hover"
        />
        <motion.div
          variants={bubbleVariants}
          custom={1}
          className="absolute bottom-10 right-20 w-80 h-80 rounded-full bg-indigo-400 opacity-10 blur-xl"
          whileHover="hover"
        />
        <motion.div
          variants={bubbleVariants}
          custom={2}
          className="absolute top-1/4 right-1/4 w-40 h-40 rounded-full bg-purple-400 opacity-10 blur-xl"
          whileHover="hover"
        />
      </motion.div>

      {/* Central logo */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        variants={logoVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div
          className="flex justify-center items-center w-32 h-32 rounded-full bg-white shadow-xl mb-6"
          animate={pulseAnimation}
        >
          <svg 
            className="w-20 h-20 text-indigo-600" 
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 5H21V11H3V5Z"></path>
            <path d="M21 11V19H3V11"></path>
            <path d="M9 11V19"></path>
            <path d="M3 11H21"></path>
            <path d="M3 15H9"></path>
          </svg>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-3xl font-bold text-gray-800 mb-2"
        >
          GatePass System
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-gray-600 text-center max-w-md px-4"
        >
          Secure and efficient gate pass management system for your organization
        </motion.p>
      </motion.div>
    </div>
  );
};
