/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}', // 👈 重要，必须包括 vue 文件
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
