import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
		fontFamily: {
			title: ['Chillax', 'sans-serif'],
			text: ['Merriweather', 'serif'],
		  },
    },
  },
  plugins: [],
}

export default config