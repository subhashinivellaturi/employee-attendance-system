/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        present: '#10B981',
        absent: '#EF4444',
        late: '#F59E0B',
        'half-day': '#F97316'
      }
    }
  },
  plugins: []
}