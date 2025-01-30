import 'server-only';

// Server-side only environment variables
export const env = {
  deepseekApiKey: process.env.DEEPSEEK_API_KEY || '',
};

// Client-side exposed variables (if needed)
export const clientEnv = {
  publicKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '', 
}; 