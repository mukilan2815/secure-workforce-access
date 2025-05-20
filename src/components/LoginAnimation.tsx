
import { motion } from "framer-motion";

const LoginAnimation = () => {
  const badgeVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: [0.8, 1.15, 0.95, 1.05, 1],
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut",
      }
    },
    pulse: {
      scale: [1, 1.05, 1],
      boxShadow: [
        "0 0 0 0 rgba(79, 70, 229, 0)",
        "0 0 0 15px rgba(79, 70, 229, 0.2)",
        "0 0 0 0 rgba(79, 70, 229, 0)"
      ],
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-36">
      <motion.div
        className="relative"
        animate={{ 
          rotate: 360 
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        {/* Outer orbit */}
        <div className="absolute w-32 h-32 rounded-full border-2 border-indigo-300/30"></div>
        
        {/* Middle orbit */}
        <motion.div
          className="absolute w-24 h-24 top-4 left-4 rounded-full border-2 border-indigo-400/40"
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        >
          {/* Dot in middle orbit */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1.5 w-3 h-3 bg-blue-500 rounded-full"
            animate={{
              boxShadow: ["0 0 0 0 rgba(59, 130, 246, 0)", "0 0 0 8px rgba(59, 130, 246, 0.3)", "0 0 0 0 rgba(59, 130, 246, 0)"],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          ></motion.div>
        </motion.div>
        
        {/* Inner orbit */}
        <div className="absolute w-16 h-16 top-8 left-8 rounded-full border-2 border-indigo-500/60"></div>
        
        {/* Badge in center */}
        <motion.div 
          className="absolute top-10 left-10 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg"
          variants={badgeVariants}
          initial="initial"
          animate={["animate", "pulse"]}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
            />
          </svg>
        </motion.div>
        
        {/* Animated particles */}
        <motion.div
          className="absolute top-4 left-16 w-2 h-2 bg-blue-400 rounded-full"
          animate={{ 
            y: [0, 8, 0],
            opacity: [0.5, 1, 0.5],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity,
            repeatType: "reverse", 
          }}
        ></motion.div>
        
        <motion.div
          className="absolute top-20 left-6 w-2 h-2 bg-indigo-500 rounded-full"
          animate={{ 
            y: [0, -8, 0],
            opacity: [0.5, 1, 0.5],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            repeatType: "reverse", 
            delay: 0.5,
          }}
        ></motion.div>
        
        <motion.div
          className="absolute top-12 left-24 w-1.5 h-1.5 bg-purple-400 rounded-full"
          animate={{ 
            x: [0, 6, 0],
            opacity: [0.5, 1, 0.5],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{ 
            duration: 2.2, 
            repeat: Infinity,
            repeatType: "reverse", 
            delay: 1,
          }}
        ></motion.div>
      </motion.div>
    </div>
  );
};

export default LoginAnimation;
