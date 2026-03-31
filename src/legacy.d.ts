// Stub declarations for legacy Vite/react-router dependencies no longer used in the Next.js app
declare module 'react-router' {
  export function useNavigate(): (path: string) => void
  export function useLocation(): { pathname: string; search: string; hash: string; key: string; state: unknown }
  export function useParams<T extends Record<string, string>>(): T
  export const Link: React.FC<{ to: string; children?: React.ReactNode; className?: string }>
}
