/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./proforma.html'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        sage: { 50: '#F0F5F0', 100: '#E1EBE1', 200: '#C3D7C3', 500: '#5B8A5B', 600: '#4A7A4A', 700: '#3A6A3A' },
        warm: { 50: '#FDF8F3', 100: '#F9EFE5', 200: '#F0E0CE', 500: '#C4956A', 600: '#A67B4F', 700: '#8B6340' },
        cream: { 50: '#FEFDFB', 100: '#FDF9F3' }
      }
    }
  },
  plugins: [],
}
