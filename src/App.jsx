
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
// Optimized: Completely disabled on mobile for performance
const FloatingImagesBackground = ({ isMobile }) => {
    // Skip rendering entirely on mobile
    if (isMobile) return null;

    // Define images
    const allImages = [
        { src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop", x: "10%", y: "10%", size: "w-48" },
        { src: "https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=2070&auto=format&fit=crop", x: "80%", y: "20%", size: "w-56" },
        { src: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop", x: "5%", y: "60%", size: "w-40" },
    ];

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
            {allImages.map((img, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{
                        opacity: [0.15, 0.3, 0.15],
                        y: [0, -15, 0],
                    }}
                    transition={{
                        duration: 10 + index * 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.5
                    }}
                    style={{ left: img.x, top: img.y, willChange: 'transform, opacity' }}
                    className={`absolute ${img.size} aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/5 opacity-20`}
                >
                    <img src={img.src} alt="" loading="lazy" className="w-full h-full object-cover" />
                </motion.div>
            ))}
        </div>
    );
};

// --- LOADING SCREEN COMPONENT ---
// Optimized: Disable SparklesCore on mobile for performance
const LoadingScreen = ({ isMobile }) => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden"
        >
            {!isMobile && (
                <div className="w-full absolute inset-0 h-screen">
                    <SparklesCore
                        id="tsparticlesfullpage"
                        background="transparent"
                        minSize={0.6}
                        maxSize={1.4}
                        particleDensity={40}
                        className="w-full h-full"
                        particleColor="#FFFFFF"
                    />
                </div>
            )}

            {isMobile && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-black to-purple-900/10" />
            )}

            <div className="relative z-20 flex flex-col items-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, filter: "blur(20px)" }}
                    animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center"
                >
                    <h1 className="md:text-8xl text-6xl font-bold text-center text-white tracking-tighter mb-8">
                        zxenxi.
                    </h1>

                    <div className="w-48 h-[1px] bg-white/5 relative overflow-hidden rounded-full">
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                ease: "easeInOut"
                            }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent w-full h-full"
                        />
                    </div>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="mt-6 text-neutral-500 text-[10px] font-bold tracking-[0.4em] uppercase"
                >
                    Initializing Core
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

    // OPTIMIZATION: Reduce or remove blur on mobile for better GPU performance
    const blurClass = isMobile ? "backdrop-blur-[2px]" : "backdrop-blur-xl";

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
                {/* Dynamic Background - Optimized: Static on mobile, animated on desktop */}
                <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
                    {isMobile ? (
                        // Static gradient background for mobile - no animations
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-pink-900/10" />
                    ) : (
                        // Animated blobs for desktop only
                        <>
                            <motion.div
                                animate={{ x: [0, 30, -20, 0], y: [0, -50, 20, 0], scale: [1, 1.1, 0.9, 1] }}
                                transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
                                style={{ willChange: 'transform' }}
                                className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30"
                            />
                            <motion.div
                                animate={{ x: [0, -40, 20, 0], y: [0, 40, -30, 0], scale: [1, 0.9, 1.1, 1] }}
                                transition={{ duration: 12, repeat: Infinity, repeatType: "mirror", delay: 1 }}
                                style={{ willChange: 'transform' }}
                                className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30"
                            />
                            <motion.div
                                animate={{ x: [0, 50, -30, 0], y: [0, 30, -50, 0], scale: [1, 1.2, 0.8, 1] }}
                                transition={{ duration: 15, repeat: Infinity, repeatType: "mirror", delay: 2 }}
                                style={{ willChange: 'transform' }}
                                className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30"
                            />
                        </>
                    )}
                </div>

                {/* Navigation */}
                <motion.nav
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, type: "spring", delay: 3.5 }}
                    className="fixed top-0 w-full z-50 px-4 md:px-6 py-6"
                >
                    <div className={`max-w-5xl mx-auto glass-morphism inner-glow rounded-full px-6 py-3 flex justify-between items-center relative z-50 shadow-2xl`}>
                        <a href="#" className="font-bold text-xl tracking-tighter flex items-center gap-2 group">
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                                className="w-9 h-9 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                            >
                                <Terminal className="w-5 h-5" />
                            </motion.div>
                            <span className="bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">zxenxi.</span>
                        </a>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex gap-10 text-[13px] font-medium tracking-wide uppercase text-neutral-400">
                            {['Profile', 'Portfolio', 'Expertise'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase() === 'profile' ? 'about' : item.toLowerCase()}`}
                                    className="hover:text-white transition-all duration-300 relative group"
                                >
                                    {item}
                                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
                                </a>
                            ))}
                        </div>

                        <div className="hidden md:block">
                            <motion.a
                                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,255,255,0.3)" }}
                                whileTap={{ scale: 0.95 }}
                                href="#contact"
                                className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300"
                            >
                                Get in touch
                            </motion.a>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden text-white p-2 hover:bg-white/5 rounded-full transition-colors"
                            onClick={toggleMobileMenu}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Mobile Menu Dropdown */}
                    <AnimatePresence>
                        {isMobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                className="absolute top-24 left-4 right-4 glass-morphism rounded-[2.5rem] p-8 md:hidden z-40 flex flex-col gap-8 shadow-2xl overflow-hidden"
                            >
                                <div className="flex flex-col gap-6 text-center text-xl font-semibold text-neutral-300">
                                    <a href="#about" onClick={closeMobileMenu} className="hover:text-white transition-colors">Profile</a>
                                    <a href="#portfolio" onClick={closeMobileMenu} className="hover:text-white transition-colors">Portfolio</a>
                                    <a href="#expertise" onClick={closeMobileMenu} className="hover:text-white transition-colors">Expertise</a>
                                    <a href="#contact" onClick={closeMobileMenu} className="bg-white text-black px-8 py-4 rounded-[1.5rem] font-bold mt-4 shadow-xl">Contact Me</a>
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
                        <FloatingImagesBackground isMobile={isMobile} />

                        {/* Hero Title Box */}
                        <motion.div
                            variants={fadeInUp}
                            className={`md:col-span-2 md:row-span-2 glass-morphism inner-glow rounded-[2.5rem] p-10 flex flex-col justify-between min-h-[450px] relative overflow-hidden group z-10 shadow-2xl`}
                        >
                            <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity duration-700 rotate-12">
                                <Cpu className="w-64 h-64" />
                            </div>
                            <div className="relative z-20">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 4 }}
                                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-400 border border-blue-500/20 mb-8"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                                    Available for work
                                </motion.div>
                                <h1 className="text-4xl md:text-5xl font-bold leading-[1.1] mb-6 tracking-tighter">
                                    Simplifying <span className="text-neutral-500">Technical Concepts,</span> <br />
                                    <span className="text-gradient">Building Global Solutions.</span>
                                </h1>
                                <p className="text-neutral-400 text-lg md:text-xl leading-relaxed max-w-md font-light">
                                    Network Engineering Educator & Technical Documentation Specialist crafting systematic digital experiences.
                                </p>
                            </div>
                            <div className="mt-12 flex items-center gap-6">
                                <motion.a
                                    whileHover={{ x: 10, color: "#60a5fa" }}
                                    href="#portfolio"
                                    className="inline-flex items-center gap-3 text-white font-semibold text-lg group transition-all"
                                >
                                    Explore my work
                                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-blue-500/50 transition-colors">
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </motion.a>
                            </div>
                        </motion.div>

                        {/* Profile Photo Box */}
                        <motion.div
                            variants={fadeInUp}
                            className={`md:col-span-1 md:row-span-2 glass-morphism inner-glow rounded-[2.5rem] overflow-hidden relative group z-10 shadow-2xl`}
                        >
                            <motion.img
                                whileHover={isMobile ? undefined : { scale: 1.05 }}
                                transition={{ duration: 0.8 }}
                                src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=1769&auto=format&fit=crop"
                                alt="Profile Workplace"
                                loading="lazy"
                                className="w-full h-full object-cover grayscale opacity-60 md:group-hover:grayscale-0 md:group-hover:opacity-100 transition-all duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-8">
                                <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold mb-1">Specialization</p>
                                <p className="text-xl font-bold text-white tracking-tight">IT Educator & Engineer</p>
                            </div>
                        </motion.div>

                        {/* Stat Box */}
                        <motion.div
                            variants={fadeInUp}
                            whileHover={isMobile ? undefined : { y: -5, boxShadow: "0 20px 40px -10px rgba(34, 197, 94, 0.2)" }}
                            className={`glass-morphism inner-glow rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center z-10 shadow-2xl transition-all duration-500`}
                        >
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/5 text-green-400 flex items-center justify-center mb-4 inner-glow border border-green-500/10">
                                <Languages className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold tracking-tighter">Bilingual</h3>
                            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.2em] mt-2">IDN & ENG Proficiency</p>
                        </motion.div>

                        {/* Social Links Box */}
                        <motion.div
                            variants={fadeInUp}
                            whileHover={isMobile ? undefined : { y: -5 }}
                            className={`glass-morphism inner-glow rounded-[2.5rem] p-8 flex items-center justify-around z-10 shadow-2xl transition-all duration-500`}
                        >
                            {[
                                { Icon: Linkedin, link: "#", color: "hover:text-blue-400" },
                                { Icon: Github, link: "#", color: "hover:text-purple-400" },
                                { Icon: Mail, link: "#", color: "hover:text-pink-400" }
                            ].map((item, index) => (
                                <motion.a
                                    key={index}
                                    whileHover={{ scale: 1.15, rotate: index % 2 === 0 ? 5 : -5 }}
                                    href={item.link}
                                    className={`relative p-4 bg-white/5 rounded-2xl transition-all duration-300 text-neutral-400 ${item.color} group shadow-lg`}
                                >
                                    <item.Icon className="w-7 h-7" />
                                    <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.a>
                            ))}
                        </motion.div>
                    </motion.section>

                    {/* Tech Stack Marquee */}
                    <motion.section
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <p className="text-center text-[10px] font-bold text-neutral-500 mb-10 uppercase tracking-[0.4em]">Core Competencies</p>
                        <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-40 hover:opacity-100 transition-opacity duration-700">
                            {[
                                { Icon: Network, label: "Networking" },
                                { Icon: FileText, label: "Documentation" },
                                { Icon: LayoutTemplate, label: "Micro SaaS" },
                                { Icon: SearchCheck, label: "UX & Prompt" },
                                { Icon: Code2, label: "Web Dev" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 font-bold text-sm tracking-tight group hover:text-white transition-colors cursor-default">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                        <item.Icon className="w-4 h-4" />
                                    </div>
                                    {item.label}
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    <section id="portfolio" className="mb-32 scroll-mt-32">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                            <div className="max-w-xl">
                                <motion.h2
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter"
                                >
                                    Selected <span className="text-gradient">Case Studies</span>
                                </motion.h2>
                                <p className="text-neutral-500 font-light leading-relaxed">
                                    A curated selection of projects where technical infrastructure meets strategic product design.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                            {PROJECTS.map((project) => (
                                <motion.div
                                    layoutId={`card-container-${project.id}`}
                                    key={project.id}
                                    onClick={() => setSelectedId(project.id)}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    whileHover={isMobile ? undefined : { y: -10 }}
                                    className={`${project.span} glass-morphism inner-glow rounded-[2.5rem] p-4 group cursor-pointer transition-all duration-500 shadow-xl border-white/5 hover:border-white/10 z-0`}
                                >
                                    <motion.div
                                        layoutId={`card-image-container-${project.id}`}
                                        className="rounded-[1.8rem] overflow-hidden aspect-[4/3] md:aspect-video mb-6 relative shadow-2xl"
                                    >
                                        <motion.img
                                            layoutId={`card-image-${project.id}`}
                                            src={project.image}
                                            alt={project.title}
                                            loading="lazy"
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Hide hover overlay on mobile */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 md:group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center">
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
                                        className="fixed inset-0 z-50 overflow-y-auto bg-black md:m-8 md:rounded-[3rem] border border-white/10 flex flex-col shadow-2xl"
                                    >
                                        {/* Close Button */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
                                            className="absolute top-8 right-8 z-50 p-3 bg-black/50 backdrop-blur-xl rounded-full text-white hover:bg-white/20 transition-all border border-white/10"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>

                                        <div className="max-w-5xl mx-auto w-full bg-black min-h-full">
                                            {/* Hero Image */}
                                            <motion.div
                                                layoutId={`card-image-container-${project.id}`}
                                                className="w-full h-[50vh] md:h-[60vh] relative overflow-hidden"
                                            >
                                                <motion.img
                                                    layoutId={`card-image-${project.id}`}
                                                    src={project.image}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                            </motion.div>

                                            <div className="p-10 md:p-20 -mt-32 relative z-10">
                                                <motion.div
                                                    layoutId={`card-category-${project.id}`}
                                                    className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border border-blue-500/20"
                                                >
                                                    {project.category}
                                                </motion.div>

                                                <motion.h3
                                                    layoutId={`card-title-${project.id}`}
                                                    className="text-5xl md:text-7xl font-bold mb-12 leading-[0.95] tracking-tighter"
                                                >
                                                    {project.title}
                                                </motion.h3>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
                                                    <div className="md:col-span-2 space-y-12">
                                                        <div>
                                                            <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-3 tracking-tight">
                                                                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                                                                    <Lightbulb className="w-5 h-5" />
                                                                </div>
                                                                The Challenge
                                                            </h4>
                                                            <p className="text-neutral-400 text-lg leading-relaxed font-light">
                                                                {project.challenge}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-3 tracking-tight">
                                                                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                                                                    <Wrench className="w-5 h-5" />
                                                                </div>
                                                                The Solution
                                                            </h4>
                                                            <p className="text-neutral-400 text-lg leading-relaxed font-light">
                                                                {project.solution}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="glass-morphism inner-glow rounded-[2.5rem] p-10 border-white/5 shadow-xl h-fit">
                                                        <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-500 mb-8 border-b border-white/5 pb-4">
                                                            Project Stack
                                                        </h4>

                                                        <div className="mb-10">
                                                            <ul className="space-y-4">
                                                                {project.features.map((feature, i) => (
                                                                    <li key={i} className="flex items-start gap-3 text-sm text-neutral-300 font-medium">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                                                        {feature}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>

                                                        <div className="flex flex-wrap gap-2">
                                                            {project.tech.map((t, i) => (
                                                                <span key={i} className="px-3 py-1.5 bg-white/5 rounded-lg text-[11px] font-bold text-neutral-400 border border-white/5 uppercase tracking-wider">
                                                                    {t}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-center pt-20 border-t border-white/5">
                                                    <button
                                                        onClick={() => setSelectedId(null)}
                                                        className="text-neutral-500 hover:text-white transition-all text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-4 group"
                                                    >
                                                        <span className="w-12 h-px bg-neutral-800 group-hover:bg-white transition-all" />
                                                        Close Case Study
                                                        <span className="w-12 h-px bg-neutral-800 group-hover:bg-white transition-all" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </>
                        )}
                    </AnimatePresence>

                    <section id="expertise" className="mb-24 scroll-mt-32">
                        <div className="text-center mb-16">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter"
                            >
                                Professional <span className="text-gradient">Expertise</span>
                            </motion.h2>
                            <p className="text-neutral-500 max-w-lg mx-auto font-light">
                                Specialized in bridge-building between complex infra and user-friendly documentation.
                            </p>
                        </div>
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        >
                            {[
                                { title: "Technical Docs", icon: Wrench, color: "text-blue-400", bg: "bg-blue-500/10", desc: "Crafting systematic, interactive guides that turn complexity into clarity." },
                                { title: "Web Strategy", icon: Lightbulb, color: "text-purple-400", bg: "bg-purple-500/10", desc: "Workflow architecture for Micro SaaS and digital product ideation." },
                                { title: "IT Education", icon: Presentation, color: "text-pink-400", bg: "bg-pink-500/10", desc: "Simplifying hardware & network concepts through creative storytelling." }
                            ].map((service, index) => {
                                const Icon = service.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        variants={fadeInUp}
                                        whileHover={{ y: -15, scale: 1.02 }}
                                        className={`glass-morphism inner-glow p-10 rounded-[2.5rem] transition-all duration-500 shadow-xl group hover:border-white/20`}
                                    >
                                        <div className={`w-14 h-14 ${service.bg} rounded-2xl flex items-center justify-center ${service.color} mb-8 inner-glow border border-white/5 group-hover:scale-110 transition-transform duration-500`}>
                                            <Icon className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-4 tracking-tight">{service.title}</h3>
                                        <p className="text-neutral-400 text-base leading-relaxed font-light">
                                            {service.desc}
                                        </p>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </section>

                    <motion.section
                        id="contact"
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className={`glass-morphism inner-glow rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden scroll-mt-32 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-white/5`}
                    >
                        <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-transparent opacity-60" />
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px]" />
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px]" />

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <span className="inline-block px-4 py-1 rounded-full bg-white/5 text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 border border-white/10 mb-8">
                                Let's build something
                            </span>
                            <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tighter leading-none">
                                Ready for a <br /><span className="text-gradient">Technical Upgrade?</span>
                            </h2>
                            <p className="text-xl text-neutral-400 mb-12 font-light max-w-xl mx-auto">
                                I specialize in infrastructure and documentation. Let's discuss how I can help your team scale.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                <motion.a
                                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,255,255,0.2)" }}
                                    whileTap={{ scale: 0.95 }}
                                    href="mailto:email@example.com"
                                    className="bg-white text-black px-10 py-5 rounded-2xl font-bold text-lg transition-all w-full sm:w-auto shadow-2xl"
                                >
                                    Email zxenxi
                                </motion.a>
                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-10 py-5 rounded-2xl font-bold text-lg border border-white/10 glass-morphism transition-all w-full sm:w-auto flex items-center justify-center gap-2 group"
                                    onClick={() => {
                                        navigator.clipboard.writeText('email@example.com');
                                        alert('Email copied to clipboard!');
                                    }}
                                >
                                    <Copy className="w-5 h-5 group-hover:rotate-12 transition-transform" /> Copy Address
                                </motion.button>
                            </div>
                        </div>
                    </motion.section>

                    <footer className="mt-24 pb-12">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5 pt-12">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center font-bold">Z</div>
                                <span className="font-bold tracking-tighter text-lg">zxenxi.</span>
                            </div>

                            <div className="flex gap-10 text-sm font-medium text-neutral-500">
                                {['LinkedIn', 'GitHub', 'Twitter'].map(social => (
                                    <a key={social} href="#" className="hover:text-white transition-colors uppercase tracking-widest text-[10px]">{social}</a>
                                ))}
                            </div>

                            <p className="text-neutral-600 text-[11px] font-medium tracking-wide uppercase">
                                &copy; 2025 Created with focus
                            </p>
                        </div>
                    </footer>

                </main>
            </div>
        </div>
    );
}
