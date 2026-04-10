import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'claude-bg': '#F5F5F5',
        'claude-sidebar': '#FFFFFF',
        'claude-border': '#E5E5E5',
        'claude-text': '#2D2D2D',
        'claude-text-secondary': '#666666',
        'claude-hover': '#F0F0F0',
        'claude-accent': '#C97A4A',
      },
    },
  },
  plugins: [],
}
export default config
