import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { loginUser } from '../../mockData';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const result = loginUser(email, password);
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

        <div className="bg-white border border-[var(--brand-dark)] p-8 mb-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm uppercase tracking-[0.15em] mb-2">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aura.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm uppercase tracking-[0.15em] mb-2">
                Password
              </label>
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

        <div className="bg-[var(--brand-dark)] text-[var(--brand-lime)] p-6 text-sm">
          <div className="text-xs uppercase tracking-[0.15em] text-[var(--brand-accent)] mb-2">
            Demo Credentials
          </div>
          <div className="space-y-2">
            <div>
              <div className="opacity-70">Admin:</div>
              <div>admin@aura.com / admin123</div>
            </div>
            <div>
              <div className="opacity-70">Vendor:</div>
              <div>vendor@furniture.com / vendor123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
