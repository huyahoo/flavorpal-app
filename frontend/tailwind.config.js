// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  // Specify the files Tailwind should scan for classes
  content: [
    "./index.html", // Your main HTML file
    "./src/**/*.{vue,js,ts,jsx,tsx}", // All Vue, JS, and TS files in the src directory
  ],
  theme: {
    // Extend Tailwind's default theme here
    extend: {
      colors: {
        // Custom color palette for FlavorPal
        'flavorpal-green': {
          light: '#6EE7B7',    // A light, vibrant green
          DEFAULT: '#10B981',  // The primary green color (Emerald 500)
          dark: '#047857',     // A darker shade for accents or text (Emerald 700)
        },
        'flavorpal-orange': {
          light: '#FDBA74',    // Amber 300
          DEFAULT: '#F59E0B',  // Amber 500 (Primary Accent)
          dark: '#B45309',     // Amber 700
        },
        'flavorpal-gray': {
          light: '#F3F4F6',    // Cool Gray 100 (Backgrounds)
          DEFAULT: '#6B7280',  // Cool Gray 500 (Text)
          dark: '#374151',     // Cool Gray 700 (Headings)
        },
        'flavorpal-blue': {
          light: '#BFDBFE',    // Sky 300
          DEFAULT: '#3B82F6',  // Sky 500 (Links)
          dark: '#1E40AF',     // Sky 700
        },
        'flavorpal-red': {
          light: '#FCA5A1',    // Red 300
          DEFAULT: '#EF4444',  // Red 500 (Error)
          dark: '#B91C1C',     // Red 700
        },
      },
      fontFamily: {
        // Example: Using Inter as the primary sans-serif font
        // sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
      },
      borderRadius: {
        'xl': '0.75rem', // Default is 0.75rem, can make it larger for a softer look
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [
    // Add any Tailwind plugins here if needed, e.g., @tailwindcss/forms for enhanced form styling
    // require('@tailwindcss/forms'),
  ],
}
