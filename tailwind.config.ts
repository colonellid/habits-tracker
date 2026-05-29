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
        // ─── Todoist DS v1.0 (new flat tokens) ─────────────────────
        paper: '#fefdfc',
        charcoal: '#25221e',
        'soft-gray': '#d7d6d4',
        peach: '#fff6f0',
        'subtle-ash': '#6f6c69',
        'dusty-sage': '#94928f',

        'action-red': '#e34432',
        'cta-hover': '#d13d2a',
        'link-orange': '#cf3520',
        'accent-blue': '#0f66ae',
        'success-green': '#4c7a45',
        'badge-green': '#446c3d',
        'light-green-tint': '#f0f6df',
        'bg-muted': 'rgba(37, 34, 30, 0.07)',
        'bg-muted-strong': 'rgba(37, 34, 30, 0.12)',

        'tint-red': 'rgba(227, 68, 50, 0.08)',
        'tint-blue': 'rgba(15, 102, 174, 0.08)',
        'tint-green': 'rgba(76, 122, 69, 0.08)',
        'tint-orange': 'rgba(207, 53, 32, 0.08)',

        // ─── Legacy aliases (compatibilidade com telas em migração) ───
        'todoist-charcoal': '#25221e',
        'todoist-paper': '#fefdfc',
        'todoist-red': '#e34432',
        'todoist-red-dark': '#d13d2a',
        'todoist-red-light': '#fdf2f1',
        'todoist-blue': '#0f66ae',
        'todoist-blue-light': '#eef3fc',
        'todoist-green': '#4c7a45',
        'todoist-green-light': '#f0f6df',
        'todoist-orange': '#cf3520',
        'todoist-orange-light': '#fff3e0',
        'todoist-purple': '#7c3aed',
        'todoist-purple-light': '#f5f3ff',
        'todoist-gray-100': '#f9f9f7',
        'todoist-gray-200': '#f0eeeb',
        'todoist-gray-300': '#d7d6d4',
        'todoist-gray-400': '#94928f',
        'todoist-gray-500': '#6f6c69',
        'todoist-gray-600': '#5c5650',
        'todoist-gray-700': '#3d3933',
        'todoist-sidebar-bg': '#1f1c19',
        'todoist-sidebar-item': '#302d29',
      },
      fontFamily: {
        display: ['Graphik', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Graphik', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '1.5' }],
        sm: ['13px', { lineHeight: '1.2' }],
        'sm-2': ['14px', { lineHeight: '1.35' }],
        base: ['15px', { lineHeight: '1.35' }],
        'base-2': ['16px', { lineHeight: '1' }],
        lg: ['17px', { lineHeight: '1.4' }],
        'lg-2': ['18px', { lineHeight: '1.75' }],
        'lg-3': ['19px', { lineHeight: '1.4' }],
        xl: ['20px', { lineHeight: '1.8' }],
        '2xl': ['22px', { lineHeight: '1.3' }],
        '3xl': ['28px', { lineHeight: '1.2' }],
        '4xl': ['38px', { lineHeight: '1.28', letterSpacing: '-0.005em' }],
        '5xl': ['44px', { lineHeight: '1.15', letterSpacing: '-0.005em' }],
        '6xl': ['55px', { lineHeight: '1', letterSpacing: '-0.01em' }],
      },
      borderRadius: {
        DEFAULT: '8px',
        badge: '6px',
        default: '8px',
        card: '10px',
        btn: '15px',
        button: '15px',
        image: '15px',
      },
      boxShadow: {
        subtle: 'rgba(37, 34, 30, 0.04) 0px 1px 0px 0px',
        lg: 'rgba(37, 34, 30, 0.07) 0px 14px 19px -9px, rgba(37, 34, 30, 0.18) 0px 10px 48px 0px',
        fab: '0 8px 24px rgba(227, 68, 50, 0.3), 0 14px 19px -9px rgba(37, 34, 30, 0.07)',
      },
      spacing: {
        '4.5': '1.125rem',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'slide-up': {
          from: { transform: 'translateY(100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          from: { transform: 'translateY(0)', opacity: '1' },
          to: { transform: 'translateY(100%)', opacity: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'slide-up': 'slide-up 280ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slide-down 200ms ease-out',
        'fade-in': 'fade-in 200ms ease-out',
        'toast-in': 'toast-in 280ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}

export default config
