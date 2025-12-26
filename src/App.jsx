import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three'; // Import Three.js langsung
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowRight,
  X 
} from 'lucide-react';
import { HyperText } from './components/HyperText';
import { TechMarquee } from './components/TechMarquee';
import { Preloader } from './components/Preloader';

// --- VARIAN ANIMASI (FRAMER MOTION) ---

const titleContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, 
      delayChildren: 0.2,   
    },
  },
};

const letterVariants = {
  hidden: { 
    opacity: 0, 
    y: 100, 
    rotateX: -90, 
    filter: 'blur(10px)' 
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    }
  },
  hover: {
    scale: 1.3,
    y: -15,
    rotate: 5,
    color: "#3b82f6", 
    textShadow: "0px 0px 8px rgb(59, 130, 246)",
    transition: { type: "spring", stiffness: 300 }
  }
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (customDelay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1], 
      delay: customDelay 
    }
  }),
};

const ambientFloat = {
  animate: {
    y: [0, -15, 0], 
    transition: {
      duration: 6,
      repeat: Infinity, 
      ease: "easeInOut"
    }
  }
};

const menuOverlayVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.5, when: "afterChildren", staggerChildren: 0.05, staggerDirection: -1 }
  }
};

const menuItemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  },
  exit: { y: 20, opacity: 0 }
};


// --- KOMPONEN BACKGROUND 3D (VANILLA THREE.JS) ---
const ThreeBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    // 1. Inisialisasi Scene
    const scene = new THREE.Scene();
    // Tambahkan kabut (fog) hitam tipis untuk kedalaman atmosfer
    scene.fog = new THREE.FogExp2(0x000000, 0.03);

    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2)); 
    // Mengaktifkan shadow map untuk realisme tambahan (jika diperlukan)
    renderer.shadowMap.enabled = !isMobile;
    
    const mount = mountRef.current;
    if (mount) {
      mount.appendChild(renderer.domElement);
    }

    // 2. Pencahayaan Dramatis
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Cahaya Utama (Biru Dingin)
    const dirLight = new THREE.DirectionalLight(0x4f90ff, 2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Cahaya Aksen (Ungu/Merah Muda) untuk Rim Light
    const pointLight = new THREE.PointLight(0xa855f7, 3, 50);
    pointLight.position.set(-5, -5, -5);
    scene.add(pointLight);

    // 3. Setup Interaksi (Mouse & Scroll)
    const mouse = new THREE.Vector2();
    const target = new THREE.Vector2();
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    let scrollY = window.scrollY;

    const onDocumentMouseMove = (event) => {
      mouse.x = (event.clientX - windowHalfX);
      mouse.y = (event.clientY - windowHalfY);
    };

    const onDocumentScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('mousemove', onDocumentMouseMove);
    window.addEventListener('scroll', onDocumentScroll);

    // 4. PARTIKEL DEBU/BINTANG (STARFIELD)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = isMobile ? 300 : 800; // Jumlah partikel
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        // Sebar partikel secara acak di ruang luas
        posArray[i] = (Math.random() - 0.5) * 30; 
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x88ccff,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending // Membuat partikel bersinar
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // 5. Membuat Objek Geometri Utama
    const shapes = [];

    // Material Factory
    const getMaterial = (color) => {
        if (isMobile) {
            // Mobile: High performance "Hologram" look
            return new THREE.MeshBasicMaterial({
                color: color,
                wireframe: true,
                transparent: true,
                opacity: 0.4
            });
        } else {
            // Desktop: Premium Glass look
            return new THREE.MeshPhysicalMaterial({
                color: color,
                roughness: 0.1,
                metalness: 0.1,
                transmission: 0.9,
                thickness: 1.0,
                ior: 1.5,
                transparent: true,
                opacity: 0.9,
                side: THREE.DoubleSide
            });
        }
    };

    const createComplexObject = (type, color, position) => {
        const meshGroup = new THREE.Group();
        meshGroup.position.set(...position);

        let mainMesh;
        const material = getMaterial(color);

        if (type === 'hero') {
            // Complex Gyroscope
            const coreGeo = new THREE.IcosahedronGeometry(1, 0);
            mainMesh = new THREE.Mesh(coreGeo, material);
            
            // Rings
            const ring1Geo = new THREE.TorusGeometry(1.4, 0.02, 16, 100);
            const ring1 = new THREE.Mesh(ring1Geo, new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.3 }));
            ring1.rotation.x = Math.PI / 2;
            
            const ring2Geo = new THREE.TorusGeometry(1.8, 0.02, 16, 100);
            const ring2 = new THREE.Mesh(ring2Geo, new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.3 }));
            
            meshGroup.add(mainMesh);
            meshGroup.add(ring1);
            meshGroup.add(ring2);
            
            // Custom animation property
            meshGroup.userData = { type: 'gyro', ring1, ring2 };

        } else if (type === 'knot') {
            // Complex Knot
            const geo = new THREE.TorusKnotGeometry(0.8, 0.25, isMobile ? 64 : 128, isMobile ? 8 : 16);
            mainMesh = new THREE.Mesh(geo, material);
            meshGroup.add(mainMesh);
        } else if (type === 'statue') {
            // Abstract Cyber Statue / Totem
            // Base
            const baseGeo = new THREE.CylinderGeometry(0.6, 0.8, 0.5, 6);
            const base = new THREE.Mesh(baseGeo, material);
            base.position.y = -1.8;
            
            // Body (Pillar)
            const bodyGeo = new THREE.ConeGeometry(0.6, 3, 6);
            const body = new THREE.Mesh(bodyGeo, material);
            
            // Head (Floating Abstract)
            const headGeo = new THREE.IcosahedronGeometry(0.7, 0);
            const head = new THREE.Mesh(headGeo, material);
            head.position.y = 2.2;

            // Orbiting Rings (Halo)
            const haloGeo = new THREE.TorusGeometry(1.2, 0.03, 16, 50);
            const halo = new THREE.Mesh(haloGeo, new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.5 }));
            halo.position.y = 2.2;
            halo.rotation.x = Math.PI / 2;

            meshGroup.add(base);
            meshGroup.add(body);
            meshGroup.add(head);
            meshGroup.add(halo);
            
            meshGroup.userData = { type: 'statue', head, halo };
        } else {
            // Standard Crystal
            const geo = new THREE.OctahedronGeometry(1.5);
            mainMesh = new THREE.Mesh(geo, material);
            meshGroup.add(mainMesh);
        }

        // Add Wireframe overlay for Desktop only (since mobile is already wireframe)
        if (!isMobile && type !== 'statue') { // Statue has multiple parts, handled differently or skip wireframe for simplicity
             const wireGeo = new THREE.WireframeGeometry(mainMesh.geometry);
             const wireMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 });
             const wireframe = new THREE.LineSegments(wireGeo, wireMat);
             mainMesh.add(wireframe);
        }
        // Special wireframe handling for statue parts if needed, or just rely on material
        if (!isMobile && type === 'statue') {
             // Add wireframe to head only for effect
             const headWire = new THREE.LineSegments(
                 new THREE.WireframeGeometry(meshGroup.userData.head.geometry),
                 new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 })
             );
             meshGroup.userData.head.add(headWire);
        }

        scene.add(meshGroup);

        return {
            mesh: meshGroup,
            initialX: position[0],
            initialY: position[1],
            initialZ: position[2],
            speed: Math.random() * 0.5 + 0.2,
            type: type
        };
    };

    // --- OBJEK 1 (HERO): Gyroscope ---
    shapes.push(createComplexObject('hero', 0xffffff, [-3.5, 2, -5]));

    // --- OBJEK 2 (PROJECTS): Complex Knot ---
    shapes.push(createComplexObject('knot', 0x3b82f6, [4, -12, -8]));

    // --- OBJEK 3 (FOOTER): Crystal ---
    shapes.push(createComplexObject('crystal', 0x6366f1, [-3, -22, -6]));
    
    // --- OBJEK 4 (FILLER): Small Crystal ---
    shapes.push(createComplexObject('crystal', 0xa855f7, [2, -6, -4]));

    // --- OBJEK 5 (NEW): Cyber Statue ---
    shapes.push(createComplexObject('statue', 0x06b6d4, [-4, -16, -7])); // Cyan color, positioned between projects and footer

    camera.position.z = 12;

    // 6. Loop Animasi
    let animationId;
    const animate = () => {
      const t = performance.now() * 0.001; 

      target.x = mouse.x * 0.0008;
      target.y = mouse.y * 0.0008;
      const scrollOffset = scrollY * 0.012; 

      // Animasi Partikel
      particlesMesh.rotation.y = t * 0.05; // Rotasi lambat semesta
      particlesMesh.position.y = -scrollY * 0.002; // Partikel bergerak naik saat scroll ke bawah (Parallax latar)

      shapes.forEach((item, index) => {
        // Rotasi Kompleks
        item.mesh.rotation.x = t * 0.2 + index + (scrollY * 0.002);
        item.mesh.rotation.y = t * 0.3 + index + (scrollY * 0.002);
        // Tambahkan rotasi Z untuk dinamika lebih
        item.mesh.rotation.z = t * 0.1; 

        // Gyroscope specific animation
        if (item.mesh.userData.type === 'gyro') {
            item.mesh.userData.ring1.rotation.x += 0.02;
            item.mesh.userData.ring1.rotation.y += 0.01;
            item.mesh.userData.ring2.rotation.x -= 0.01;
            item.mesh.userData.ring2.rotation.y += 0.02;
        }

        // Statue specific animation
        if (item.mesh.userData.type === 'statue') {
            // Head looks around
            item.mesh.userData.head.rotation.y = Math.sin(t * 0.5) * 0.5;
            // Halo spins and wobbles
            item.mesh.userData.halo.rotation.z -= 0.02;
            item.mesh.userData.halo.rotation.x = (Math.PI / 2) + Math.sin(t) * 0.1;
            // Keep statue upright-ish despite global rotation
            item.mesh.rotation.x = 0; 
            item.mesh.rotation.z = Math.sin(t * 0.5) * 0.05; // Slight sway
        }
        
        // Posisi & Parallax
        const floatingY = Math.sin(t * item.speed) * 0.3;
        const mouseEffectX = target.x * (index + 2); 
        const mouseEffectY = target.y * (index + 2);
        const scrollEffectY = scrollOffset; 

        item.mesh.position.x += ((item.initialX + mouseEffectX) - item.mesh.position.x) * 0.05;
        const targetY = item.initialY + floatingY + mouseEffectY + scrollEffectY;
        item.mesh.position.y += (targetY - item.mesh.position.y) * 0.08;
      });

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', onDocumentMouseMove);
      window.removeEventListener('scroll', onDocumentScroll); 
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      
      // Fix cleanup for Groups
      shapes.forEach(item => {
        // Traverse the group to find all meshes
        item.mesh.traverse((child) => {
            if (child.isMesh) {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(m => m.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            }
        });
      });

      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

// --- KOMPONEN UTAMA PORTOFOLIO ---
const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const containerRef = useRef(null);
  const { scrollYProgress, scrollY } = useScroll();

  // --- NEW: MOUSE SPOTLIGHT STATE ---
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);
  // ----------------------------------

  const nameLetters = "zxenxi".split("");

  const handleScroll = (e, targetId) => {
    e.preventDefault();
    setIsMenuOpen(false); 
    const element = document.querySelector(targetId);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth' });
      }, 500); 
    }
  };

  useEffect(() => {
    // Loading handled by Preloader component
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  // --- DATA PROYEK DIPERBARUI ---
  const projects = [
    { 
      title: "PPKA UMPWR", 
      year: "2024", 
      type: "Academic Portal", 
      link: "https://ppka.umpwr.ac.id/" 
    },
    { 
      title: "Mie Lethek Palur", 
      year: "2025", 
      type: "Culinary & E-Commerce", 
      link: "https://www.mielethekpalur.com" 
    },
  ];

  // Data Social Media dengan URL asli
  const socialLinks = [
    { name: 'Instagram', url: 'https://www.instagram.com/zxenxi/' }, // Placeholder jika belum ada
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/firmansyah-al-fatoni-774905247/' },
    { name: 'Github', url: '#' } // Placeholder jika belum ada
  ];

  return (
    <div ref={containerRef} className="relative bg-[#080808] text-white selection:bg-blue-500 selection:text-white overflow-x-hidden min-h-screen">
      
      <AnimatePresence mode="wait">
        {!isLoaded && <Preloader onComplete={() => setIsLoaded(true)} />}
      </AnimatePresence>

      {/* --- NEW: CURSOR SPOTLIGHT --- */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`
        }}
      />
      {/* ----------------------------- */}

      {/* Background 3D Vanilla Three.js */}
      <ThreeBackground />

      {/* --- MENU OVERLAY FULLSCREEN --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={menuOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center"
          >
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-8 right-8 p-4 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all group"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>

            <nav className="flex flex-col items-center gap-8 mb-12">
              {['work', 'about', 'contact'].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item}`}
                  onClick={(e) => handleScroll(e, `#${item}`)}
                  variants={menuItemVariants}
                  className="text-5xl md:text-7xl font-serif italic tracking-tighter hover:text-blue-500 active:text-blue-500 transition-colors cursor-pointer"
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </motion.a>
              ))}
            </nav>

            <motion.div variants={menuItemVariants} className="flex gap-8 mt-8">
               {socialLinks.map((link) => (
                 <a 
                   key={link.name}
                   href={link.url} 
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-xs uppercase tracking-[0.2em] opacity-50 hover:opacity-100 transition-opacity"
                 >
                   {link.name}
                 </a>
               ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- REPLACED NAV: FLOATING ISLAND --- */}
      <motion.nav 
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: -100, opacity: 0 }
        }}
        animate="visible"
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 px-6 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-lg shadow-black/20"
      >
        <div 
          className="text-sm font-bold tracking-tighter cursor-pointer hover:text-blue-400 transition-colors"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          zxenxi.dev
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <div className="w-[1px] h-4 bg-white/20"></div>
          {['work', 'about', 'contact'].map((item) => (
             <a 
               key={item} 
               href={`#${item}`} 
               onClick={(e) => handleScroll(e, `#${item}`)}
               className="text-[10px] uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-blue-400 active:opacity-100 active:text-blue-400 transition-all"
             >
               {item}
             </a>
          ))}
        </div>

        <button 
          onClick={() => setIsMenuOpen(true)}
          className="md:hidden text-[10px] uppercase tracking-widest font-bold hover:text-blue-400 active:text-blue-400 transition-colors"
        >
          Menu
        </button>
      </motion.nav>
      {/* ------------------------------------- */}

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 z-10 perspective-1000">
        <AnimatePresence>
          {isLoaded && (
            <motion.div 
              variants={ambientFloat}
              animate="animate"
              className="flex flex-col items-center"
            >
              <motion.h2
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                custom={0} 
                className="text-[10px] md:text-[12px] uppercase tracking-[0.5em] font-semibold mb-8 opacity-40"
              >
                Design & Digital Engineering
              </motion.h2>
              
              <motion.h1
                variants={titleContainerVariants}
                initial="hidden"
                animate="visible"
                className="text-6xl md:text-[160px] font-serif italic tracking-tighter leading-none mb-10 flex justify-center overflow-visible cursor-default"
              >
                {nameLetters.map((letter, index) => (
                  <motion.span
                    key={index}
                    variants={letterVariants}
                    whileHover="hover" 
                    whileTap="hover"
                    className="inline-block origin-bottom px-1" 
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.h1>

              <motion.div 
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                custom={0.8} 
                className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16"
              >
                <p className="max-w-[280px] text-[10px] md:text-xs uppercase tracking-[0.2em] leading-relaxed opacity-50 text-center md:text-left">
                  Specializing in creating immersive digital environments and technical architectures.
                </p>
                <motion.div 
                  animate={{ scaleY: [1, 1.4, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent hidden md:block"
                />
                <p className="max-w-[280px] text-[10px] md:text-xs uppercase tracking-[0.2em] leading-relaxed opacity-50 text-center md:text-right">
                  Based in digital space. Currently crafting next-gen web solutions.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 1.5 } }}
          style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
        >
          <span className="text-[9px] uppercase tracking-widest">Scroll to explore</span>
          <div className="w-[1px] h-10 bg-white/20" />
        </motion.div>
      </section>

      {/* Daftar Proyek */}
      <section id="work" className="relative py-40 px-6 md:px-20 z-10">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-[10px] uppercase tracking-[0.4em] opacity-30 mb-20 border-l-2 border-white/20 pl-4">Selected Projects</h3>
          
          <div className="space-y-0 border-t border-white/10">
            {projects.map((project, i) => (
              <motion.a 
                key={i}
                href={project.link}
                target="_blank" 
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group block border-b border-white/10 py-12 md:py-20 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-white/5 active:bg-white/5 transition-colors px-4 relative overflow-hidden"
              >
                <div className="flex items-baseline gap-6 mb-4 md:mb-0 z-10">
                  <span className="font-mono text-[10px] opacity-30 italic">0{i + 1}</span>
                  <h4 className="text-4xl md:text-8xl font-serif tracking-tighter group-hover:italic group-active:italic transition-all duration-500">
                    <HyperText>{project.title}</HyperText>
                  </h4>
                </div>
                
                <div className="flex items-center justify-between md:justify-end gap-12 z-10">
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-widest opacity-40 mb-1">{project.type}</p>
                    <p className="text-sm font-medium">{project.year}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black group-active:bg-white group-active:text-black transition-all">
                    <ArrowUpRight size={20} />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          <div className="mt-20 flex justify-center">
             <button className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] font-bold opacity-40 hover:opacity-100 active:opacity-100 transition-all">
               View All Works <ArrowRight size={14} className="group-hover:translate-x-2 group-active:translate-x-2 transition-transform" />
             </button>
          </div>
        </div>
      </section>

      {/* Bagian Tentang Saya */}
      <section id="about" className="py-40 bg-[#0a0a0a] relative z-10">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-20 mb-20">
          <div>
            <h3 className="text-4xl md:text-6xl font-serif italic mb-8">Creative Tech Engineering.</h3>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              My approach blends technical rigor with artistic curiosity. I believe the best digital products feel like magic because they are grounded in seamless performance and beautiful motion.
            </p>
          </div>
          <div className="flex flex-col justify-end space-y-12">
            <div>
               <h5 className="text-[9px] uppercase tracking-widest opacity-30 mb-4 font-bold">Vision</h5>
               <p className="font-serif text-2xl">Building for the next generation of founders and visionaries.</p>
            </div>
          </div>
        </div>

        <div className="w-full">
          <TechMarquee />
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-40 px-6 relative z-10 border-t border-white/5 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-blue-600/10 blur-[150px] -z-10 pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-blue-400 mb-10 font-medium">
              Ready to start the journey?
            </h3>
            
            <h2 className="text-3xl md:text-5xl font-light mb-16 leading-relaxed opacity-80">
              Transforming abstract ideas into <br className="hidden md:block"/>
              <span className="font-serif italic text-white opacity-100 text-4xl md:text-6xl">high-performance digital reality.</span>
            </h2>

            <motion.a 
              href="mailto:falfatoni@gmail.com" 
              className="inline-block group relative"
              whileHover="hover"
              whileTap="hover"
            >
              <div className="relative overflow-hidden">
                <motion.span 
                  className="block text-6xl md:text-[130px] font-serif italic tracking-tighter leading-none relative z-10 transition-colors duration-500 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-indigo-500 group-active:text-transparent group-active:bg-clip-text group-active:bg-gradient-to-r group-active:from-blue-400 group-active:to-indigo-500"
                >
                  Let's Collaborate
                </motion.span>
                <motion.div 
                  className="h-[2px] bg-blue-500 absolute bottom-2 left-0 w-full origin-left"
                  initial={{ scaleX: 0 }}
                  variants={{ hover: { scaleX: 1 } }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>
              
              <motion.div 
                className="flex items-center justify-center gap-2 mt-6 text-xs uppercase tracking-[0.3em] opacity-50 group-hover:opacity-100 transition-opacity"
                variants={{ hover: { y: 5 } }}
              >
                <span>Send me an email</span>
                <ArrowUpRight size={12} />
              </motion.div>
            </motion.a>
          </motion.div>

          <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-8 pt-32 mt-20 border-t border-white/5">
            <div className="flex gap-10">
              {socialLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[9px] uppercase tracking-[0.2em] font-bold opacity-40 hover:opacity-100 active:opacity-100 transition-opacity"
                >
                  {link.name}
                </a>
              ))}
            </div>
            <p className="text-[9px] uppercase tracking-[0.2em] opacity-20">
              © 2025 zxenxi.dev — All rights reserved
            </p>
            <div className="flex gap-10">
               <span className="text-[9px] uppercase tracking-[0.2em] opacity-40 italic cursor-pointer hover:text-white active:text-white" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>Back to top</span>
            </div>
          </div>
        </div>
      </footer>

      <div className="fixed inset-0 pointer-events-none opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-50"></div>
    </div>
  );
};

export default App;
