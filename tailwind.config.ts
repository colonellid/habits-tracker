import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Todoist Design Tokens
        'todoist-charcoal': '#25221e',
        'todoist-paper': '#fefdfc',
        'todoist-red': '#e34432',
        'todoist-red-dark': '#c0392b',
        'todoist-red-light': '#fdf2f1',
        'todoist-blue': '#246fe0',
        'todoist-blue-light': '#eef3fc',
        'todoist-green': '#058527',
        'todoist-green-light': '#e8f5e9',
        'todoist-orange': '#e57f1e',
        'todoist-orange-light': '#fff3e0',
        'todoist-purple': '#7c3aed',
        'todoist-purple-light': '#f5f3ff',
        'todoist-gray-100': '#f9f9f7',
        'todoist-gray-200': '#f0eeeb',
        'todoist-gray-300': '#e0ddd8',
        'todoist-gray-400': '#b8b3ab',
        'todoist-gray-500': '#8a837a',
        'todoist-gray-600': '#5c5650',
        'todoist-gray-700': '#3d3933',
        'todoist-sidebar-bg': '#1f1c19',
        'todoist-sidebar-item': '#302d29',
      },
      fontFamily: {
        heading: ['Graphik', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        button: '15px',
        badge: '6px',
        card: '10px',
      },
      boxShadow: {
        subtle: '0 1px 3px rgba(0,0,0,0.08)',
        lg: '0 4px 16px rgba(0,0,0,0.12)',
      },
      spacing: {
        '4.5': '1.125rem',
      },
    },
  },
  plugins: [],
}

export default config
