module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        custom: {
          500: '#00DEA3', // Agregando el color personalizado
          600: '#DE8500',
        },
      },
    },
  },
  plugins: [],
}