
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            animation: {
                scroll: 'scroll 15s linear infinite',
                marquee: 'marquee 25s linear infinite',
            },
            keyframes: {
                scroll: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
                marquee: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                }
            }
        },
    },
    plugins: [
        function ({ addUtilities }) {
            addUtilities({
                '.glass-morphism': {
                    '@apply bg-[#171717]/60 backdrop-blur-xl border border-white/10': {},
                },
                '.premium-shadow': {
                    'box-shadow': '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
                },
                '.text-gradient': {
                    '@apply bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400': {},
                },
                '.inner-glow': {
                    'box-shadow': 'inset 0 0 20px rgba(255, 255, 255, 0.05)',
                },
            })
        },
    ],
}
