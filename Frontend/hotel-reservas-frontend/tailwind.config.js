
export default {
    content: ['./index.html', '../hotel-reservas-frontend/src/**/*.{vue,js}'],
    theme:{
        extend:{
            colors:{
                primary:{
                    50: '#f0f9ff',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    900: '#082f49',
                },
                slate:{
                    50: '#f8fafc',
                    900: '#0f172a',
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-in': 'slideIn 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                '0%': { opacity: '0' },
                '100%': { opacity: '1' },
                },
                slideIn: {
                '0%': { transform: 'translateY(10px)', opacity: '0' },
                '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}