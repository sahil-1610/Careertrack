import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { GoCopilot } from "react-icons/go";
import { SiOpenai, SiGooglegemini , SiMeta} from "react-icons/si";
import { meta } from "lucide-react"; // Changed from Meta to Facebook as it's more reliable

export function FeatureBlockAnimatedCard() {
  return (
    <Card>
      <CardSkeletonContainer>
        <AnimatedSkeleton />
      </CardSkeletonContainer>
      <CardTitle>Start New Interview</CardTitle>
      <CardDescription>
        Begin your AI mock interview session with our intelligent system
      </CardDescription>
    </Card>
  );
}

const AnimatedSkeleton = () => {
  const controls = useAnimation();
  const sequence = async () => {
    await controls.start({
      scale: [1, 1.1, 1],
      y: [0, -4, 0],
      transition: { duration: 0.8 },
    });
  };

  useEffect(() => {
    sequence();
    const intervalId = setInterval(sequence, 2000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="p-8 overflow-hidden h-full relative flex items-center justify-center">
      <div className="flex flex-row shrink-0 justify-center items-center gap-2">
        <motion.div animate={controls} className="h-8 w-8">
          <Container className="circle-1">
            <SiOpenai className="h-4 w-4 dark:text-white" />
          </Container>
        </motion.div>
        <motion.div animate={controls} className="h-12 w-12">
          <Container className="circle-2">
            <GoCopilot className="h-6 w-6 dark:text-white" />
          </Container>
        </motion.div>
        <motion.div animate={controls} className="h-12 w-12">
          <Container className="circle-3">
            <SiGooglegemini className="h-6 w-6 dark:text-white" />
          </Container>
        </motion.div>
        <motion.div animate={controls} className="h-10 w-10">
          <Container className="circle-4">
            <SiMeta className="h-5 w-5 dark:text-white" />
          </Container>
        </motion.div>
      </div>
      <div className="h-40 w-px absolute top-20 m-auto z-40 bg-gradient-to-b from-transparent via-cyan-500 to-transparent animate-move">
        <div className="w-10 h-32 top-1/2 -translate-y-1/2 absolute -left-10">
          <Sparkles />
        </div>
      </div>
    </div>
  );
};

const Card = ({ className, children }) => {
  return (
    <div
      className={`max-w-xs w-full mx-auto p-4 sm:p-6 rounded-xl border border-[rgba(255,255,255,0.10)] dark:bg-[rgba(40,40,40,0.70)] bg-gray-100 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group ${className}`}
    >
      {children}
    </div>
  );
};

const CardTitle = ({ children, className }) => {
  return (
    <h3
      className={`text-lg font-semibold text-gray-800 dark:text-white py-2 ${className}`}
    >
      {children}
    </h3>
  );
};

const CardDescription = ({ children, className }) => {
  return (
    <p
      className={`text-sm font-normal text-neutral-600 dark:text-neutral-400 max-w-sm ${className}`}
    >
      {children}
    </p>
  );
};

const CardSkeletonContainer = ({
  className,
  children,
  showGradient = true,
}) => {
  return (
    <div
      className={`h-[12rem] md:h-[15rem] rounded-xl z-40 ${className} ${
        showGradient &&
        "bg-neutral-300 dark:bg-[rgba(40,40,40,0.70)] [mask-image:radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)]"
      }`}
    >
      {children}
    </div>
  );
};

const Container = ({ className, children }) => {
  return (
    <div
      className={`h-16 w-16 rounded-full flex items-center justify-center bg-[rgba(248,248,248,0.01)]
    shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]
    ${className}`}
    >
      {children}
    </div>
  );
};

const Sparkles = () => {
  const randomMove = () => Math.random() * 2 - 1;
  const randomOpacity = () => Math.random();
  const random = () => Math.random();

  return (
    <div className="absolute inset-0">
      {[...Array(12)].map((_, i) => (
        <motion.span
          key={`star-${i}`}
          animate={{
            top: `calc(${random() * 100}% + ${randomMove()}px)`,
            left: `calc(${random() * 100}% + ${randomMove()}px)`,
            opacity: randomOpacity(),
            scale: [1, 1.2, 0],
          }}
          transition={{
            duration: random() * 2 + 4,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            top: `${random() * 100}%`,
            left: `${random() * 100}%`,
            width: `2px`,
            height: `2px`,
            borderRadius: "50%",
            zIndex: 1,
          }}
          className="inline-block bg-black dark:bg-white"
        ></motion.span>
      ))}
    </div>
  );
};

export default FeatureBlockAnimatedCard;
