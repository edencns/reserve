'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../src/app/components/Button';
import { Input } from '../../src/app/components/Input';
import { toast } from 'sonner';

export default function StaffLoginPage() {
  const router = useRouter();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/staff-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push('/');
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
          <h1 className="font-serif text-6xl mb-4">EDEN-FAIR LINK</h1>
          <p className="text-sm uppercase tracking-[0.15em] opacity-50">로그인</p>
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
              {loading ? '로그인 중...' : '로그인'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
