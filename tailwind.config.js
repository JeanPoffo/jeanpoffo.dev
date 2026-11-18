// @ts-check
const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './node_modules/pliny/**/*.js',
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './layouts/**/*.{js,ts,tsx}',
    './data/**/*.mdx',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        mono: ['var(--font-mono)', ...fontFamily.mono],
      },
      colors: {
        // Warm clay accent and warm neutrals (paper #faf9f5, ink #141413)
        primary: {
          50: '#fbf1ec',
          100: '#f6e0d6',
          200: '#efc2ae',
          300: '#e69f82',
          400: '#d97757',
          500: '#c15f3c',
          600: '#a94e2f',
          700: '#8a3f26',
          800: '#6b311e',
          900: '#4d2316',
          950: '#2e150d',
        },
        gray: {
          50: '#faf9f5',
          100: '#f1efe8',
          200: '#e3e0d6',
          300: '#cfccc1',
          400: '#b0aea5',
          500: '#87867f',
          600: '#65645e',
          700: '#3d3d3a',
          800: '#262624',
          900: '#1a1a18',
          950: '#141413',
        },
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            lineHeight: '1.7',
            a: {
              color: theme('colors.primary.500'),
              textDecorationThickness: '1px',
              textUnderlineOffset: '3px',
              fontWeight: '400',
              '&:hover': {
                color: `${theme('colors.primary.600')}`,
              },
              code: { color: theme('colors.primary.400') },
            },
            'h1,h2,h3,h4': {
              fontWeight: '500',
              letterSpacing: theme('letterSpacing.tight'),
            },
            strong: { fontWeight: '600' },
            code: {
              color: theme('colors.primary.500'),
              fontWeight: '400',
            },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
            pre: {
              backgroundColor: theme('colors.gray.900'),
              borderRadius: '0',
              border: `1px solid ${theme('colors.gray.800')}`,
            },
            img: { borderRadius: '0' },
            blockquote: {
              fontWeight: '400',
              fontStyle: 'normal',
              borderLeftColor: theme('colors.primary.400'),
            },
            'ul > li::marker': { color: theme('colors.primary.400') },
            'ol > li::marker': { color: theme('colors.gray.500'), fontFamily: 'var(--font-mono)' },
          },
        },
        invert: {
          css: {
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: `${theme('colors.primary.400')}`,
              },
              code: { color: theme('colors.primary.400') },
            },
            color: theme('colors.gray.300'),
            'h1,h2,h3,h4,h5,h6': {
              color: theme('colors.gray.50'),
            },
            strong: { color: theme('colors.gray.50') },
            code: { color: theme('colors.primary.400') },
            blockquote: { color: theme('colors.gray.300') },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
