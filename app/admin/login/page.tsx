'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../../../src/app/components/Button';
import { Input } from '../../../src/app/components/Input';
import { loginUser } from '../../../src/app/mockData';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const router = useRouter();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginUser(id, password);
    if (result.success) {
      toast.success('로그인 성공!');
      router.push('/admin');
    } else {
      toast.error(result.error || '로그인 실패');
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

            <Button type="submit" variant="solid" size="lg" className="w-full">
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
