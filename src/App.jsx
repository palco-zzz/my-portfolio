
import React, { useState, useEffect, useRef, useId } from 'react';
import { SpeedInsights } from "@vercel/speed-insights/react"
import { motion, AnimatePresence } from 'framer-motion';
import {
    Terminal,
    Cpu,
    Languages,
    Linkedin,
    Github,
    Mail,
    Network,
    FileText,
    LayoutTemplate,
    SearchCheck,
    Code2,
    Wrench,
    Lightbulb,
    Presentation,
    Copy,
    ArrowRight,
    Play,
    Menu,
    X
} from 'lucide-react';

// --- SPARKLES CORE COMPONENT (Aceternity Style) ---
const SparklesCore = ({
    id,
    background = "transparent",
    minSize = 0.6,
    maxSize = 1.4,
    particleDensity = 100,
    className = "h-full w-full",
    particleColor = "#FFFFFF",
}) => {
    const canvasRef = useRef(null);
    const canvasId = useId();
    const [context, setContext] = useState(null);
    const [particles, setParticles] = useState([]);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (canvasRef.current) {
            setContext(canvasRef.current.getContext("2d"));
        }
    }, []);

    useEffect(() => {
        if (canvasRef.current) {
            const { clientWidth, clientHeight } = canvasRef.current.parentElement;
            setDimensions({ width: clientWidth, height: clientHeight });
            canvasRef.current.width = clientWidth;
            canvasRef.current.height = clientHeight;

            const particleCount = (particleDensity * (clientWidth * clientHeight)) / 10000;
            const newParticles = [];

            for (let i = 0; i < particleCount; i++) {
                newParticles.push({
                    x: Math.random() * clientWidth,
                    y: Math.random() * clientHeight,
                    size: Math.random() * (maxSize - minSize) + minSize,
                    speedX: Math.random() * 0.5 - 0.25,
                    speedY: Math.random() * 0.5 - 0.25,
                    opacity: Math.random(),
                    direction: Math.random() > 0.5 ? 1 : -1,
                });
            }
            setParticles(newParticles);
        }
    }, [maxSize, minSize, particleDensity]);

    useEffect(() => {
        let animationFrameId;

        const render = () => {
            if (context && canvasRef.current) {
                context.clearRect(0, 0, dimensions.width, dimensions.height);

                particles.forEach((particle) => {
                    particle.x += particle.speedX;
                    particle.y += particle.speedY;
                    particle.opacity += 0.01 * particle.direction;

                    if (particle.opacity >= 1) {
                        particle.direction = -1;
                    } else if (particle.opacity <= 0) {
                        particle.direction = 1;
                        // Reset position if faded out completely for a continuous feel
                        particle.x = Math.random() * dimensions.width;
                        particle.y = Math.random() * dimensions.height;
                    }

                    // Wrap around screen
                    if (particle.x > dimensions.width) particle.x = 0;
                    if (particle.x < 0) particle.x = dimensions.width;
                    if (particle.y > dimensions.height) particle.y = 0;
                    if (particle.y < 0) particle.y = dimensions.height;

                    context.globalAlpha = particle.opacity;
                    context.fillStyle = particleColor;
                    context.beginPath();
                    context.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
                    context.fill();
                });

                animationFrameId = requestAnimationFrame(render);
            }
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [context, dimensions, particles, particleColor]);

    return (
        <canvas
            ref={canvasRef}
            id={id || canvasId}
            className={className}
            style={{ background }}
        />
    );
};

// --- FLOATING IMAGES BACKGROUND (Parallax Effect) ---
const FloatingImagesBackground = () => {
    // Define images
    const allImages = [
        { src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop", x: "10%", y: "10%", size: "w-32 md:w-48" }, // Coding
        { src: "https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=2070&auto=format&fit=crop", x: "80%", y: "20%", size: "w-40 md:w-56" }, // Server
        { src: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop", x: "5%", y: "60%", size: "w-28 md:w-40" }, // Chip
        { src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop", x: "85%", y: "70%", size: "w-36 md:w-52" }, // Abstract Tech
        { src: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=2070&auto=format&fit=crop", x: "50%", y: "40%", size: "w-24 md:w-32" }, // Network
    ];

    // OPTIMIZATION: Show fewer images on mobile to reduce layer count/compositing
    // We can use CSS to hide them, or simple logic. CSS is better for SSR/hydration consistency.
    // Using 'hidden md:block' on the last 3 images.

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
            {allImages.map((img, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{
                        opacity: [0.2, 0.4, 0.2],
                        y: [0, -20, 0],
                        x: [0, 10, 0],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                        duration: 8 + index * 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.5
                    }}
                    style={{ left: img.x, top: img.y }}
                    // OPTIMIZATION: Hidden on mobile for index > 1 (keep only first 2)
                    className={`absolute ${img.size} ${index > 1 ? 'hidden md:block' : 'block'} aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/5 opacity-30 filter blur-[1px]`}
                >
                    <img src={img.src} alt="Background decoration" className="w-full h-full object-cover" />
                </motion.div>
            ))}
        </div>
    );
};

// --- LOADING SCREEN COMPONENT ---
// Re-added isMobile prop processing for density
const LoadingScreen = ({ isMobile }) => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden"
        >
            <div className="w-full absolute inset-0 h-screen">
                <SparklesCore
                    id="tsparticlesfullpage"
                    background="transparent"
                    minSize={0.6}
                    maxSize={1.4}
                    // OPTIMIZATION: Reduce density on mobile
                    particleDensity={isMobile ? 30 : 50}
                    className="w-full h-full"
                    particleColor="#FFFFFF"
                />
            </div>

            <div className="relative z-20 flex flex-col items-center">
                <motion.h1
                    initial={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
                    animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="md:text-7xl text-5xl lg:text-9xl font-bold text-center text-white relative tracking-tight"
                >
                    zxenxi
                </motion.h1>

                {/* Gradients for text effect */}
                <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
                <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
                <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
                <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="mt-4 text-neutral-400 text-sm md:text-base font-light tracking-widest uppercase"
                >
                    Loading Portfolio
                </motion.p>
            </div>
        </motion.div>
    );
};


// --- EXISTING ANIMATION VARIANTS ---
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const scaleHover = {
    rest: { scale: 1 },
    hover: {
        scale: 1.02,
        y: -5,
        transition: { type: "spring", stiffness: 400, damping: 10 }
    }
};

// --- PROJECTS DATA ---
const PROJECTS = [
    {
        id: "proj1",
        title: "Network Troubleshooting Guide",
        category: "Documentation",
        image: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=1887&auto=format&fit=crop",
        description: "An interactive, step-by-step documentation platform designed to help TJKT students diagnose network issues systematically.",
        challenge: "Students struggled to visualize the invisible flow of data packets during troubleshooting, leading to confusion and ineffective diagnosis.",
        solution: "Built a reproducible guide using interactive diagrams and decision trees that visualize the flow of data.",
        features: ["Flowchart-based diagnosis", "Cisco Packet Tracer scenarios", "Mobile-friendly reference"],
        tech: ["React", "Mermaid.js", "Docusaurus"],
        span: "md:col-span-1"
    },
    {
        id: "proj2",
        title: "Local Micro SaaS Analysis",
        category: "Consulting",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
        description: "A comprehensive market research and architectural blueprint for a SaaS product tailored to the Indonesian MSME market.",
        challenge: "Global SaaS solutions are often too expensive or complex for local small businesses, creating a barrier to entry.",
        solution: "Designed a workflow architecture that adapts global AI trends for local needs using affordable APIs and familiar interfaces.",
        features: ["Local Payment Gateway design", "WhatsApp-first UI/UX approach", "Localized pricing model"],
        tech: ["Next.js Architecture", "Stripe/Midtrans API", "Figma"],
        span: "md:col-span-1"
    },
    {
        id: "proj3",
        title: "Prompt Engineering for Education",
        category: "UX & AI Optimization",
        image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2070&auto=format&fit=crop",
        description: "A system of optimized AI prompts to generate personalized teaching materials for vocational students.",
        challenge: "Generic AI outputs often lack the specific context needed for vocational (SMK) technical training.",
        solution: "Developed a framework of 'Persona-Context-Task' prompts that output consistent, high-quality lesson plans and quizzes.",
        features: ["Adaptive difficulty levels", "Analogies generator", "Persona-based responses"],
        tech: ["OpenAI API", "Python scripts", "Prompt Patterns"],
        span: "md:col-span-2"
    }
];

// --- MAIN APP COMPONENT ---
export default function App() {
    const [loading, setLoading] = useState(true);
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false); // Mobile Detection State
    const [selectedId, setSelectedId] = useState(null); // Project Expansion State
    const playerRef = useRef(null);

    // Mobile Detection Logic
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Scroll Lock when Modal is Open
    useEffect(() => {
        if (selectedId) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [selectedId]);

    // Loading Timer
    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3500); // 3.5 seconds loading

        return () => clearTimeout(timer);
    }, []);

    // --- YOUTUBE API SETUP ---
    useEffect(() => {
        // 1. Load the IFrame Player API code asynchronously.
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // 2. This function creates an <iframe> (and YouTube player)
        //    after the API code downloads.
        window.onYouTubeIframeAPIReady = () => {
            playerRef.current = new window.YT.Player('youtube-audio-player', {
                height: '0',
                width: '0',
                videoId: 'fYD7YsSRHOY', // Playboi Carti - Rather Lie to You
                playerVars: {
                    'playsinline': 1,
                    'controls': 0,
                    'start': 40, // Start at 40 seconds
                    'loop': 1,
                    'playlist': 'fYD7YsSRHOY' // Required for loop to work
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange,
                }
            });
        };

        return () => {
            // Cleanup if necessary
        }
    }, []);

    const onPlayerReady = (event) => {
        // Player is ready, but we wait for loading to finish
        // volume can be set here
        event.target.setVolume(50);
    };

    const onPlayerStateChange = (event) => {
        // 1 = playing
        if (event.data === 1) {
            setIsMusicPlaying(true);
        } else {
            setIsMusicPlaying(false);
        }
    };

    // --- AUDIO AUTO-PLAY LOGIC (AGGRESSIVE) ---
    useEffect(() => {
        if (!loading && playerRef.current && playerRef.current.playVideo) {
            const attemptPlay = () => {
                try {
                    // playerRef.current.seekTo(40); // Dont seek repeatedly
                    playerRef.current.playVideo();
                } catch (e) { console.error("Play failed", e) }
            };

            // 1. Immediate Attempt
            attemptPlay();

            // 2. Fallback: Listen for ANY interaction to unblock audio
            const unlockAudio = () => {
                attemptPlay();
                // Remove listener after first success or attempt
                window.removeEventListener('click', unlockAudio);
                window.removeEventListener('keydown', unlockAudio);
                window.removeEventListener('touchstart', unlockAudio);
                window.removeEventListener('scroll', unlockAudio);
            };

            window.addEventListener('click', unlockAudio);
            window.addEventListener('keydown', unlockAudio);
            window.addEventListener('touchstart', unlockAudio);
            window.addEventListener('scroll', unlockAudio);

            return () => {
                window.removeEventListener('click', unlockAudio);
                window.removeEventListener('keydown', unlockAudio);
                window.removeEventListener('touchstart', unlockAudio);
                window.removeEventListener('scroll', unlockAudio);
            };
        }
    }, [loading]);

    const toggleMusic = () => {
        if (playerRef.current && playerRef.current.getPlayerState) {
            const state = playerRef.current.getPlayerState();
            // 1 = playing, 2 = paused, 5 = cued, -1 = unstarted
            if (state === 1) {
                playerRef.current.pauseVideo();
            } else {
                playerRef.current.playVideo();
            }
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    }

    // OPTIMIZATION: Reduce blur on mobile for simpler rendering
    const blurClass = "backdrop-blur-md md:backdrop-blur-xl";

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-blue-500/30 selection:text-blue-200 overflow-x-hidden">
            <SpeedInsights />

            {/* Global Style for Smooth Scrolling */}
            <style>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>

            {/* --- HIDDEN YOUTUBE PLAYER CONTAINER --- */}
            <div id="youtube-audio-player" className="absolute top-0 left-0 w-0 h-0 overflow-hidden opacity-0 pointer-events-none" />

            {/* Music Control Button */}
            {!loading && (
                <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleMusic}
                    // OPTIMIZATION: Less blur on button
                    className="fixed bottom-6 right-6 z-50 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white shadow-lg hover:bg-white/20 transition-all group"
                    title={isMusicPlaying ? "Pause Music" : "Play Music"}
                >
                    {isMusicPlaying ? (
                        <div className="relative">
                            {/* Using Pause Icon when playing */}
                            <div className="flex gap-1">
                                <span className="animate-[music-bar_1s_ease-in-out_infinite] inline-block w-1 h-3 bg-green-500 rounded-full"></span>
                                <span className="animate-[music-bar_1s_ease-in-out_0.2s_infinite] inline-block w-1 h-4 bg-green-500 rounded-full"></span>
                                <span className="animate-[music-bar_1s_ease-in-out_0.4s_infinite] inline-block w-1 h-2 bg-green-500 rounded-full"></span>
                            </div>
                            <style>{`
                  @keyframes music-bar {
                    0%, 100% { height: 8px; }
                    50% { height: 16px; }
                  }
               `}</style>
                        </div>
                    ) : (
                        <Play className="w-5 h-5 text-neutral-300 ml-0.5" />
                    )}
                </motion.button>
            )}

            {/* Loading Screen Overlay - Moving pass isMobile prop */}
            <AnimatePresence>
                {loading && <LoadingScreen key="loading-screen" isMobile={isMobile} />}
            </AnimatePresence>

            {/* Main Content (Only visible after loading starts fading or exiting) */}
            <div className={`${loading ? 'fixed inset-0 overflow-hidden' : ''}`}>
                {/* Dynamic Background */}
                <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{ x: [0, 30, -20, 0], y: [0, -50, 20, 0], scale: [1, 1.1, 0.9, 1] }}
                        // OPTIMIZATION: Slower duration on mobile
                        transition={{ duration: isMobile ? 15 : 10, repeat: Infinity, repeatType: "mirror" }}
                        className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30"
                    />
                    <motion.div
                        animate={{ x: [0, -40, 20, 0], y: [0, 40, -30, 0], scale: [1, 0.9, 1.1, 1] }}
                        transition={{ duration: isMobile ? 18 : 12, repeat: Infinity, repeatType: "mirror", delay: 1 }}
                        className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30"
                    />
                    <motion.div
                        animate={{ x: [0, 50, -30, 0], y: [0, 30, -50, 0], scale: [1, 1.2, 0.8, 1] }}
                        transition={{ duration: isMobile ? 22 : 15, repeat: Infinity, repeatType: "mirror", delay: 2 }}
                        className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30"
                    />
                </div>

                {/* Navigation */}
                <motion.nav
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, type: "spring", delay: 3.5 }}
                    className="fixed top-0 w-full z-50 px-4 md:px-6 py-4"
                >
                    {/* OPTIMIZATION: Switch blurs */}
                    <div className={`max-w-5xl mx-auto bg-[#171717]/60 ${blurClass} border border-white/10 rounded-full px-6 py-3 flex justify-between items-center relative z-50`}>
                        <a href="#" className="font-bold text-xl tracking-tight flex items-center gap-2">
                            <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center">
                                <Terminal className="w-4 h-4" />
                            </div>
                            <span>zxenxi.</span>
                        </a>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex gap-8 text-sm font-medium text-neutral-400">
                            <a href="#about" className="hover:text-white transition-colors">Profile</a>
                            <a href="#projects" className="hover:text-white transition-colors">Portfolio</a>
                            <a href="#services" className="hover:text-white transition-colors">Expertise</a>
                        </div>

                        <div className="hidden md:block">
                            <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href="#contact"
                                className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-neutral-200 transition-colors"
                            >
                                Contact
                            </motion.a>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden text-white p-2"
                            onClick={toggleMobileMenu}
                        >
                            {isMobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>

                    {/* Mobile Menu Dropdown */}
                    <AnimatePresence>
                        {isMobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                // OPTIMIZATION: Reduced blur
                                className="absolute top-20 left-4 right-4 bg-[#171717]/90 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:hidden z-40 flex flex-col gap-6 shadow-2xl"
                            >
                                <div className="flex flex-col gap-4 text-center text-lg font-medium text-neutral-300">
                                    <a href="#about" onClick={closeMobileMenu} className="hover:text-white transition-colors py-2 border-b border-white/5">Profile</a>
                                    <a href="#projects" onClick={closeMobileMenu} className="hover:text-white transition-colors py-2 border-b border-white/5">Portfolio</a>
                                    <a href="#services" onClick={closeMobileMenu} className="hover:text-white transition-colors py-2 border-b border-white/5">Expertise</a>
                                    <a href="#contact" onClick={closeMobileMenu} className="bg-white text-black px-5 py-3 rounded-full font-bold mt-2 hover:bg-neutral-200 transition-colors">Contact Me</a>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.nav>

                {/* Main Content Area */}
                <main className="max-w-5xl mx-auto px-6 pt-32 pb-20">

                    {/* Hero Section */}
                    <motion.section
                        id="about"
                        initial="hidden"
                        whileInView="visible" // Changed to whileInView to trigger after loading screen removal might be better, or delay it
                        animate={!loading ? "visible" : "hidden"} // Trigger animation only after loading
                        variants={staggerContainer}
                        className="relative grid grid-cols-1 md:grid-cols-4 grid-rows-auto md:grid-rows-2 gap-4 mb-24 scroll-mt-32"
                    >
                        {/* FLOATING PARALLAX IMAGES BACKGROUND */}
                        <FloatingImagesBackground />

                        {/* Hero Title Box */}
                        <motion.div
                            variants={fadeInUp}
                            // OPTIMIZATION: Use Switch blur
                            className={`md:col-span-2 md:row-span-2 bg-[#171717]/80 ${blurClass} border border-white/10 rounded-[2rem] p-8 flex flex-col justify-between min-h-[400px] relative overflow-hidden group z-10`}
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                                <Cpu className="w-32 h-32" />
                            </div>
                            <div>
                                <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-blue-300 border border-white/5 mb-4">
                                    👋 Hi, I'm zxenxi
                                </span>
                                <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                                    Simplifying Technical Concepts, <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Building Global Solutions.</span>
                                </h1>
                                <p className="text-neutral-400 text-base md:text-lg leading-relaxed">
                                    Network Engineering Educator (TJKT) & Technical Documentation Specialist focusing on Web Consulting, Micro SaaS Ideation, and UX Optimization.
                                </p>
                            </div>
                            <div className="mt-8">
                                <motion.a
                                    whileHover={{ x: 5 }}
                                    href="#projects"
                                    className="inline-flex items-center gap-2 text-white font-medium transition-all"
                                >
                                    View Projects <ArrowRight className="w-4 h-4" />
                                </motion.a>
                            </div>
                        </motion.div>

                        {/* Profile Photo Box */}
                        <motion.div
                            variants={fadeInUp}
                            // OPTIMIZATION: Use Switch blur
                            className={`md:col-span-1 md:row-span-2 bg-[#171717]/80 ${blurClass} border border-white/10 rounded-[2rem] overflow-hidden relative group z-10`}
                        >
                            <motion.img
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.5 }}
                                src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=1769&auto=format&fit=crop"
                                alt="Profile Workplace"
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                                <p className="text-sm text-neutral-300">Specialization</p>
                                <p className="font-semibold text-white">Full-time IT & Education</p>
                            </div>
                        </motion.div>

                        {/* Stat Box */}
                        <motion.div
                            variants={fadeInUp}
                            whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(34, 197, 94, 0.2)" }}
                            // OPTIMIZATION: Use Switch blur
                            className={`bg-[#171717]/80 ${blurClass} border border-white/10 rounded-[2rem] p-6 flex flex-col justify-center items-center text-center z-10`}
                        >
                            <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-3">
                                <Languages className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold">Bilingual</h3>
                            <p className="text-xs text-neutral-400 uppercase tracking-wider mt-1">Indonesian & English</p>
                        </motion.div>

                        {/* Social Links Box */}
                        <motion.div
                            variants={fadeInUp}
                            whileHover={{ y: -5 }}
                            // OPTIMIZATION: Use Switch blur
                            className={`bg-[#171717]/80 ${blurClass} border border-white/10 rounded-[2rem] p-6 flex items-center justify-around z-10`}
                        >
                            {[
                                { Icon: Linkedin, link: "#" },
                                { Icon: Github, link: "#" },
                                { Icon: Mail, link: "#" }
                            ].map((item, index) => (
                                <motion.a
                                    key={index}
                                    whileHover={{ scale: 1.2, rotate: 5, backgroundColor: "rgba(255,255,255,0.2)" }}
                                    href={item.link}
                                    className="p-3 bg-white/5 rounded-full transition-colors text-white"
                                >
                                    <item.Icon className="w-6 h-6" />
                                </motion.a>
                            ))}
                        </motion.div>
                    </motion.section>

                    {/* Tech Stack Marquee */}
                    <motion.section
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 0.8 }}
                        viewport={{ once: true }}
                        className="mb-24"
                    >
                        <p className="text-center text-sm text-neutral-500 mb-6 uppercase tracking-widest">Competencies & Tools</p>
                        <div className="flex flex-wrap justify-center gap-8 md:gap-12 grayscale hover:grayscale-0 transition-all duration-500">
                            <div className="flex items-center gap-2 font-semibold text-lg"><Network /> Networking</div>
                            <div className="flex items-center gap-2 font-semibold text-lg"><FileText /> Documentation</div>
                            <div className="flex items-center gap-2 font-semibold text-lg"><LayoutTemplate /> Micro SaaS</div>
                            <div className="flex items-center gap-2 font-semibold text-lg"><SearchCheck /> UX & Prompt</div>
                            <div className="flex items-center gap-2 font-semibold text-lg"><Code2 /> Web Dev</div>
                        </div>
                    </motion.section>

                    {/* Projects Section - Renovated for Expansion */}
                    <section id="projects" className="mb-24 scroll-mt-32">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeInUp}
                            className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4"
                        >
                            <div>
                                <h2 className="text-3xl font-bold mb-2">Case Studies & Projects</h2>
                                <p className="text-neutral-400">A blend of network engineering, technical education, and web development.</p>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                            {PROJECTS.map((project) => (
                                <motion.div
                                    layoutId={`card-container-${project.id}`}
                                    key={project.id}
                                    onClick={() => setSelectedId(project.id)}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    whileHover={{ scale: 1.02 }}
                                    // Switch blur for performance
                                    className={`${project.span} bg-[#171717]/60 ${blurClass} border border-white/10 rounded-[2rem] p-3 group cursor-pointer hover:border-white/20 transition-colors z-0`}
                                >
                                    <motion.div
                                        layoutId={`card-image-container-${project.id}`}
                                        className="rounded-[1.5rem] overflow-hidden aspect-[4/3] md:aspect-video mb-4 relative"
                                    >
                                        <motion.img
                                            layoutId={`card-image-${project.id}`}
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium">View Details</span>
                                        </div>
                                    </motion.div>
                                    <div className="px-3 pb-2">
                                        <motion.h3 layoutId={`card-title-${project.id}`} className="text-xl font-bold mb-1">{project.title}</motion.h3>
                                        <motion.p layoutId={`card-category-${project.id}`} className="text-neutral-400 text-sm mb-2">{project.category}</motion.p>
                                        <p className="text-neutral-500 text-sm line-clamp-2">{project.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* EXPANDED PROJECT MODAL */}
                    <AnimatePresence>
                        {selectedId && (
                            <>
                                {/* Backdrop */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setSelectedId(null)}
                                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                                />

                                {/* Modal */}
                                {PROJECTS.filter(item => item.id === selectedId).map(project => (
                                    <motion.div
                                        layoutId={`card-container-${project.id}`}
                                        key={project.id}
                                        className="fixed inset-0 z-50 overflow-y-auto bg-[#1a1a1a] md:m-8 md:rounded-[2rem] border border-white/10 flex flex-col"
                                    >
                                        {/* Close Button */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
                                            className="absolute top-6 right-6 z-50 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>

                                        <div className="max-w-5xl mx-auto w-full bg-[#1a1a1a] min-h-full">
                                            {/* Hero Image */}
                                            <motion.div
                                                layoutId={`card-image-container-${project.id}`}
                                                className="w-full h-[40vh] md:h-[50vh] relative overflow-hidden"
                                            >
                                                <motion.img
                                                    layoutId={`card-image-${project.id}`}
                                                    src={project.image}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
                                            </motion.div>

                                            <div className="p-8 md:p-12 -mt-20 relative z-10">
                                                <motion.div layoutId={`card-category-${project.id}`} className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-500/10">
                                                    {project.category}
                                                </motion.div>

                                                <motion.h3 layoutId={`card-title-${project.id}`} className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                                                    {project.title}
                                                </motion.h3>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                                                    <div className="space-y-8">
                                                        <div>
                                                            <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                                                                <Lightbulb className="w-5 h-5 text-yellow-500" /> The Challenge
                                                            </h4>
                                                            <p className="text-neutral-400 leading-relaxed">
                                                                {project.challenge}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                                                                <Wrench className="w-5 h-5 text-green-500" /> The Solution
                                                            </h4>
                                                            <p className="text-neutral-400 leading-relaxed">
                                                                {project.solution}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="bg-white/5 rounded-2xl p-8 border border-white/5">
                                                        <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                                            <Code2 className="w-5 h-5 text-purple-500" /> Key Features & Tech
                                                        </h4>

                                                        <div className="mb-6">
                                                            <p className="text-xs text-neutral-500 uppercase tracking-widest mb-3">Key Features</p>
                                                            <ul className="space-y-2">
                                                                {project.features.map((feature, i) => (
                                                                    <li key={i} className="flex items-center gap-2 text-sm text-neutral-300">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                                                        {feature}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>

                                                        <div>
                                                            <p className="text-xs text-neutral-500 uppercase tracking-widest mb-3">Technology Stack</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {project.tech.map((t, i) => (
                                                                    <span key={i} className="px-3 py-1 bg-white/10 rounded-lg text-xs font-medium text-white border border-white/5">
                                                                        {t}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-center pt-8 border-t border-white/5">
                                                    <button onClick={() => setSelectedId(null)} className="text-neutral-400 hover:text-white transition-colors text-sm font-medium">
                                                        Close Project Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </>
                        )}
                    </AnimatePresence>

                    {/* Services Section */}
                    <section id="services" className="mb-24 scroll-mt-32">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl font-bold mb-10 text-center"
                        >
                            Professional Services
                        </motion.h2>
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        >
                            {[
                                { title: "Tech Docs", icon: Wrench, color: "text-blue-400", bg: "bg-blue-500/20", desc: "Creating reproducible technical documentation and systematic troubleshooting solutions." },
                                { title: "Consulting", icon: Lightbulb, color: "text-purple-400", bg: "bg-purple-500/20", desc: "Digital ideation, workflow architecture, and web development consulting." },
                                { title: "Adaptive Teaching", icon: Presentation, color: "text-pink-400", bg: "bg-pink-500/20", desc: "Creative approach using analogies and multimedia to explain complex concepts." }
                            ].map((service, index) => {
                                const Icon = service.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        variants={fadeInUp}
                                        whileHover={{ y: -10, backgroundColor: "rgba(255,255,255,0.08)" }}
                                        // OPTIMIZATION: Use Switch blur
                                        className={`bg-[#171717]/60 ${blurClass} border border-white/10 p-8 rounded-[2rem] transition-colors`}
                                    >
                                        <div className={`w-12 h-12 ${service.bg} rounded-2xl flex items-center justify-center ${service.color} mb-6`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                                        <p className="text-neutral-400 text-sm leading-relaxed">
                                            {service.desc}
                                        </p>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </section>

                    {/* Contact/Footer */}
                    <motion.section
                        id="contact"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        // OPTIMIZATION: Use Switch blur
                        className={`bg-[#171717]/60 ${blurClass} border border-white/10 rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden scroll-mt-32`}
                    >
                        <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40 opacity-50" />

                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready for Full-time IT Collaboration?</h2>
                            <p className="text-lg text-neutral-300 mb-10">
                                I am open to consulting opportunities, system development, or full-time technical roles. Let's discuss your needs.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <motion.a
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    href="mailto:email@example.com"
                                    className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-neutral-200 transition w-full sm:w-auto"
                                >
                                    Contact via Email
                                </motion.a>
                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 rounded-full font-bold text-lg border border-white/20 transition w-full sm:w-auto flex items-center justify-center gap-2"
                                    onClick={() => alert('Contact copied!')}
                                >
                                    <Copy className="w-5 h-5" /> Copy Contact
                                </motion.button>
                            </div>
                        </div>
                    </motion.section>

                    <footer className="mt-16 text-center text-neutral-500 text-sm">
                        <p>&copy; 2025 zxenxi. All rights reserved.</p>
                        <div className="flex justify-center gap-6 mt-4">
                            <a href="#" className="hover:text-white transition">LinkedIn</a>
                            <a href="#" className="hover:text-white transition">GitHub</a>
                            <a href="#" className="hover:text-white transition">Blog</a>
                        </div>
                    </footer>

                </main>
            </div>
        </div>
    );
}
