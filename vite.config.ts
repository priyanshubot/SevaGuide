import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Exposes both VITE_ and SUPABASE_ prefixed variables to the client bundle
  envPrefix: ['VITE_', 'SUPABASE_'],
});
