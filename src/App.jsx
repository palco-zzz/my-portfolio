import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three'; // Import Three.js langsung
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowRight,
  X 
} from 'lucide-react';

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

    const createTechCrystal = (geometry, color, position) => {
      // Material Kaca Premium
      const material = new THREE.MeshPhysicalMaterial({
        color: color,
        roughness: 0.1,  // Sangat halus/mengkilap
        metalness: 0.1,
        transmission: 0.9, // Sangat transparan
        thickness: 1.0,
        ior: 1.5,       // Indeks bias seperti kaca
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...position);
      
      // TAMBAHAN: Wireframe Overlay (Efek Tech)
      // Membuat kerangka kawat putih tipis di sekeliling objek
      const wireGeo = new THREE.WireframeGeometry(geometry);
      const wireMat = new THREE.LineBasicMaterial({ 
          color: 0xffffff, 
          transparent: true, 
          opacity: 0.15 
      });
      const wireframe = new THREE.LineSegments(wireGeo, wireMat);
      mesh.add(wireframe); // Menjadikan wireframe anak dari mesh utama

      scene.add(mesh);
      
      return { 
        mesh, 
        initialX: position[0],
        initialY: position[1], 
        initialZ: position[2],
        speed: Math.random() * 0.5 + 0.2 
      };
    };

    // --- OBJEK 1 (HERO): Octahedron (Berlian) ---
    shapes.push(createTechCrystal(
      new THREE.OctahedronGeometry(1.4, 0), // Bentuk tajam seperti berlian
      0xffffff, 
      [-3.5, 2, -5] 
    ));

    // --- OBJEK 2 (PROJECTS): Torus Knot (Cincin Kompleks) ---
    shapes.push(createTechCrystal(
      new THREE.TorusKnotGeometry(0.8, 0.25, isMobile ? 64 : 100, isMobile ? 8 : 16), 
      0x3b82f6, // Biru
      [4, -12, -8] 
    ));

    // --- OBJEK 3 (FOOTER): Icosahedron (Kristal Bola) ---
    shapes.push(createTechCrystal(
      new THREE.IcosahedronGeometry(1.5, 0), 
      0x6366f1, // Indigo
      [-3, -22, -6] 
    ));
    
    // --- OBJEK 4 (FILLER): Tetrahedron Kecil ---
    shapes.push(createTechCrystal(
        new THREE.TetrahedronGeometry(0.6), 
        0xa855f7, // Ungu
        [2, -6, -4] 
    ));

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
      shapes.forEach(item => {
        item.mesh.geometry.dispose();
        item.mesh.material.dispose();
        // Bersihkan wireframe juga
        item.mesh.children.forEach(child => {
            if(child.geometry) child.geometry.dispose();
            if(child.material) child.material.dispose();
        });
      });
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

// --- KOMPONEN UTAMA PORTOFOLIO ---
const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();

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
    const timer = setTimeout(() => setIsLoaded(true), 150);
    return () => clearTimeout(timer);
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
      year: "2024", 
      type: "Culinary & E-Commerce", 
      link: "https://www.mielethekpalur.com" 
    },
  ];

  // Data Social Media dengan URL asli
  const socialLinks = [
    { name: 'Instagram', url: '#' }, // Placeholder jika belum ada
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/firmansyah-al-fatoni-774905247/' },
    { name: 'Github', url: '#' } // Placeholder jika belum ada
  ];

  return (
    <div ref={containerRef} className="relative bg-[#080808] text-white selection:bg-blue-500 selection:text-white overflow-x-hidden min-h-screen">
      
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
                  className="text-5xl md:text-7xl font-serif italic tracking-tighter hover:text-blue-500 transition-colors cursor-pointer"
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

      {/* Navigasi Utama */}
      <nav className="fixed top-0 left-0 w-full z-50 p-8 flex justify-between items-center mix-blend-difference">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-lg font-bold tracking-tighter cursor-pointer z-[60]"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          zxenxi.dev
        </motion.div>
        
        <div className="hidden md:flex gap-12 text-[11px] uppercase tracking-[0.3em] font-medium opacity-50 hover:opacity-100 transition-opacity z-[60]">
          {['work', 'about', 'contact'].map((item) => (
             <a 
               key={item} 
               href={`#${item}`} 
               onClick={(e) => handleScroll(e, `#${item}`)}
               className="hover:line-through cursor-pointer"
             >
               {item.charAt(0).toUpperCase() + item.slice(1)}
             </a>
          ))}
        </div>

        <button 
          onClick={() => setIsMenuOpen(true)}
          className="text-[11px] uppercase tracking-widest font-bold border border-white/20 px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all backdrop-blur-sm z-[60]"
        >
          Menu
        </button>
      </nav>

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
                className="group block border-b border-white/10 py-12 md:py-20 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-white/5 transition-colors px-4 relative overflow-hidden"
              >
                <div className="flex items-baseline gap-6 mb-4 md:mb-0 z-10">
                  <span className="font-mono text-[10px] opacity-30 italic">0{i + 1}</span>
                  <h4 className="text-4xl md:text-8xl font-serif tracking-tighter group-hover:italic transition-all duration-500">
                    {project.title}
                  </h4>
                </div>
                
                <div className="flex items-center justify-between md:justify-end gap-12 z-10">
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-widest opacity-40 mb-1">{project.type}</p>
                    <p className="text-sm font-medium">{project.year}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <ArrowUpRight size={20} />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          <div className="mt-20 flex justify-center">
             <button className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] font-bold opacity-40 hover:opacity-100 transition-all">
               View All Works <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
             </button>
          </div>
        </div>
      </section>

      {/* Bagian Tentang Saya */}
      <section id="about" className="py-40 px-6 bg-[#0a0a0a] relative z-10">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-20">
          <div>
            <h3 className="text-4xl md:text-6xl font-serif italic mb-8">Creative Tech Engineering.</h3>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              My approach blends technical rigor with artistic curiosity. I believe the best digital products feel like magic because they are grounded in seamless performance and beautiful motion.
            </p>
          </div>
          <div className="flex flex-col justify-end space-y-12">
            <div>
              <h5 className="text-[9px] uppercase tracking-widest opacity-30 mb-4 font-bold">Core Focus</h5>
              <div className="flex flex-wrap gap-2">
                {['Interactive UI', '3D Web', 'Performance', 'Astro', 'React'].map(tag => (
                  <span key={tag} className="px-3 py-1.5 rounded-full border border-white/10 text-[10px] font-mono hover:bg-white hover:text-black transition-colors cursor-default">{tag}</span>
                ))}
              </div>
            </div>
            <div>
               <h5 className="text-[9px] uppercase tracking-widest opacity-30 mb-4 font-bold">Vision</h5>
               <p className="font-serif text-2xl">Building for the next generation of founders and visionaries.</p>
            </div>
          </div>
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
            >
              <div className="relative overflow-hidden">
                <motion.span 
                  className="block text-6xl md:text-[130px] font-serif italic tracking-tighter leading-none relative z-10 transition-colors duration-500 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-indigo-500"
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
                  className="text-[9px] uppercase tracking-[0.2em] font-bold opacity-40 hover:opacity-100 transition-opacity"
                >
                  {link.name}
                </a>
              ))}
            </div>
            <p className="text-[9px] uppercase tracking-[0.2em] opacity-20">
              © 2025 zxenxi.dev — All rights reserved
            </p>
            <div className="flex gap-10">
               <span className="text-[9px] uppercase tracking-[0.2em] opacity-40 italic cursor-pointer hover:text-white" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>Back to top</span>
            </div>
          </div>
        </div>
      </footer>

      <div className="fixed inset-0 pointer-events-none opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-50"></div>
    </div>
  );
};

export default App;
