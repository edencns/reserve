import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { loginUser } from '../../mockData';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginUser(id, password);
    if (result.success) {
      toast.success('로그인 성공!');
      navigate('/admin');
    } else {
      toast.error(result.error || '로그인 실패');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--brand-lime)] flex items-center justify-center px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link to="/" className="text-xs uppercase tracking-[0.15em] hover:text-[var(--brand-accent)] transition-colors inline-block mb-8">
            ← Back to Home
          </Link>
          <h1 className="font-serif text-6xl mb-4">Admin Login</h1>
          <p className="text-lg opacity-70">Welcome back to Aura Fairs</p>
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
