/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Google Sans', 'Google Sans Text', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        m3: {
          primary: '#0b57d0',
          'on-primary': '#ffffff',
          'primary-container': '#d3e3fd',
          'on-primary-container': '#041e49',
          secondary: '#444746',
          'on-secondary': '#ffffff',
          'secondary-container': '#e1e3e1',
          'on-secondary-container': '#1d1b20',
          tertiary: '#00639b',
          'tertiary-container': '#c2e7ff',
          'on-tertiary-container': '#001d35',
          surface: '#f8fafd',
          'surface-dim': '#dadce0',
          'surface-bright': '#ffffff',
          'surface-container-lowest': '#ffffff',
          'surface-container-low': '#f0f4f9',
          'surface-container': '#e9eef6',
          'surface-container-high': '#e3e8ef',
          'surface-container-highest': '#dde3ea',
          'on-surface': '#1f1f1f',
          'on-surface-variant': '#444746',
          outline: '#747775',
          'outline-variant': '#c4c7c5',
          success: '#146c2e',
          'success-container': '#c4eed0',
          'on-success-container': '#072711',
          error: '#ba1a1a',
          'error-container': '#ffdad6',
          'on-error-container': '#410002',
        }
      },
      borderRadius: {
        '3xl': '28px',
        '4xl': '36px',
      },
      boxShadow: {
        'm3-1': '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
        'm3-2': '0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
        'm3-3': '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.30)',
        'm3-4': '0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px 0px rgba(0, 0, 0, 0.30)',
      }
    },
  },
  plugins: [],
}
