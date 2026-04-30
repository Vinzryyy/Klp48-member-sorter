/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  			display: ['Poppins', 'Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  			kawaii: ['Fredoka', 'Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  			script: ['Caveat', 'cursive']
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			shimmer: {
  				'0%': { transform: 'translateX(-100%)' },
  				'100%': { transform: 'translateX(200%)' }
  			},
  			twinkle: {
  				'0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
  				'50%': { opacity: '1', transform: 'scale(1.4)' }
  			},
  			aurora: {
  				'0%, 100%': { transform: 'translate3d(0, 0, 0) rotate(0deg)' },
  				'33%': { transform: 'translate3d(40px, -30px, 0) rotate(120deg)' },
  				'66%': { transform: 'translate3d(-30px, 20px, 0) rotate(240deg)' }
  			},
  			'glow-pulse': {
  				'0%, 100%': { boxShadow: '0 0 24px rgba(16,185,129,0.45), 0 0 0 0 rgba(16,185,129,0.6)' },
  				'50%': { boxShadow: '0 0 48px rgba(16,185,129,0.75), 0 0 0 12px rgba(16,185,129,0)' }
  			},
  			'gradient-shift': {
  				'0%, 100%': { backgroundPosition: '0% 50%' },
  				'50%': { backgroundPosition: '100% 50%' }
  			},
  			float: {
  				'0%, 100%': { transform: 'translateY(0px)' },
  				'50%': { transform: 'translateY(-12px)' }
  			},
  			wiggle: {
  				'0%, 100%': { transform: 'rotate(-2deg)' },
  				'50%': { transform: 'rotate(2deg)' }
  			},
  			'pop-in': {
  				'0%': { transform: 'scale(0.8) rotate(-6deg)', opacity: '0' },
  				'60%': { transform: 'scale(1.05) rotate(2deg)', opacity: '1' },
  				'100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' }
  			}
  		},
  		animation: {
  			shimmer: 'shimmer 2.4s ease-in-out infinite',
  			twinkle: 'twinkle 3.5s ease-in-out infinite',
  			aurora: 'aurora 18s ease-in-out infinite',
  			'glow-pulse': 'glow-pulse 2.4s ease-in-out infinite',
  			'gradient-shift': 'gradient-shift 6s ease infinite',
  			float: 'float 4s ease-in-out infinite',
  			wiggle: 'wiggle 2.6s ease-in-out infinite',
  			'pop-in': 'pop-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sakura: {
  				50:  '#fff1f7',
  				100: '#ffe4ee',
  				200: '#fbcfe0',
  				300: '#f9a8c4',
  				400: '#f472a6',
  				500: '#ec4899',
  				600: '#db2777',
  				700: '#be185d'
  			},
  			cream: {
  				DEFAULT: '#fff8f0',
  				deep: '#fef3e6'
  			},
  			ink: '#064e3b'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
