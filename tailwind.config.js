/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#131314',
          dim: '#131314',
          bright: '#393939',
          lowest: '#0e0e0e',
          low: '#1b1c1c',
          container: '#1f2020',
          high: '#2a2a2a',
          highest: '#343535',
        },
        primary: {
          DEFAULT: '#82d0f6',
          container: '#489abd',
        },
        secondary: {
          DEFAULT: '#becaba',
          container: '#3f4a3e',
        },
        tertiary: {
          DEFAULT: '#d5c4ab',
          container: '#9d8f77',
        },
        outline: '#899298',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'sm': '0.125rem',
        'DEFAULT': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
      },
      spacing: {
        'base': '4px',
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
      }
    },
  },
  plugins: [],
}
