import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Zap, Eye, EyeOff, Loader2 } from 'lucide-react';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { LoginDto } from '@/types';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginDto>();

  const onSubmit = async (data: LoginDto) => {
    try {
      setIsLoading(true);
      const res = await authService.login(data);
      setAuth(res.user, res.token);
      toast.success(`Welcome back, ${res.user.name}!`);
      navigate('/');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, #4f7dff, #7c5cff)' }}>
            <Zap size={22} color="#fff" />
          </div>
          <h1 className="font-serif text-3xl mb-1" style={{ color: 'var(--text)' }}>Welcome back</h1>
          <p className="text-sm" style={{ color: 'var(--text3)' }}>Sign in to your LeadsIQ dashboard</p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text2)' }}>
                Email Address
              </label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
                })}
                type="email"
                placeholder="you@company.com"
                className="input-field"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text2)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-field pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text3)' }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-60"
              style={{ background: 'var(--accent)' }}
            >
              {isLoading ? <><Loader2 size={15} className="animate-spin" /> Signing in…</> : 'Sign In'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5 p-3 rounded-lg text-xs" style={{ background: 'var(--bg3)', color: 'var(--text3)', border: '1px solid var(--border)' }}>
            <p className="font-semibold mb-1" style={{ color: 'var(--text2)' }}>Demo credentials</p>
            <p>Admin: <span style={{ color: 'var(--text)' }}>admin@demo.com / admin123</span></p>
            <p>Sales: <span style={{ color: 'var(--text)' }}>sales@demo.com / sales123</span></p>
          </div>
        </div>

        <p className="text-center text-sm mt-5" style={{ color: 'var(--text3)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent)' }} className="font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
