'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../../../src/app/components/Button';
import { Input } from '../../../src/app/components/Input';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const router = useRouter();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('로그인 성공!');
        router.push('/admin');
        router.refresh();
      } else {
        toast.error(data.error || '로그인 실패');
      }
    } catch {
      toast.error('서버 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--brand-lime)] flex items-center justify-center px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link href="/" className="text-xs uppercase tracking-[0.15em] hover:text-[var(--brand-accent)] transition-colors inline-block mb-8">
            ← Back to Home
          </Link>
          <h1 className="font-serif text-6xl mb-4">Admin Login</h1>
          <p className="text-lg opacity-70">Welcome back to EDEN-Fair Link</p>
        </div>

        <div className="bg-white border border-[var(--brand-dark)] p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm uppercase tracking-[0.15em] mb-2">ID</label>
              <Input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="아이디를 입력하세요"
                required
              />
            </div>

            <div>
              <label className="block text-sm uppercase tracking-[0.15em] mb-2">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" variant="solid" size="lg" className="w-full" disabled={loading}>
              {loading ? '로그인 중...' : 'Login'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
