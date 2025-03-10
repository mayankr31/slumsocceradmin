// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'
// import typography from '@tailwindcss/typography'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss({ config: { plugins: [typography] } }),],
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      config: {
        plugins: [],
      },
    }),
  ],
})
