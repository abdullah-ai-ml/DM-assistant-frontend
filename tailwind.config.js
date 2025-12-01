// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // 1. ADD YOUR SOURCE FILE PATHS HERE (REQUIRED!)
    './src/**/*.{html,js,ts,jsx,tsx}', // Adjust this path if your files are elsewhere
    './index.html', // Common for single-page apps

    // 2. KEEP 'content.container' to enable the container utility
    'content.container'
  ],
  theme: {
    extend: {
      colors: {
        'brand-gray': {
          '700': '#4A5568',
        },
        'custom-gray': '#E5E7EB',
      },
      fontFamily: {
        'lexands': ['Lexands', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
