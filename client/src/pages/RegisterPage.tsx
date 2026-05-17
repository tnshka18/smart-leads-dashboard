import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Zap, Eye, EyeOff, Loader2 } from 'lucide-react';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { RegisterDto, UserRole } from '@/types';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterDto>();

  const onSubmit = async (data: RegisterDto) => {
    try {
      setIsLoading(true);
      const res = await authService.register(data);
      setAuth(res.user, res.token);
      toast.success('Account created! Welcome to LeadsIQ');
      navigate('/');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, #4f7dff, #7c5cff)' }}>
            <Zap size={22} color="#fff" />
          </div>
          <h1 className="font-serif text-3xl mb-1" style={{ color: 'var(--text)' }}>Create account</h1>
          <p className="text-sm" style={{ color: 'var(--text3)' }}>Start managing your leads today</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text2)' }}>Full Name</label>
              <input {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
                placeholder="Rahul Sharma" className="input-field" />
              {errors.name && <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text2)' }}>Email Address</label>
              <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
                type="email" placeholder="you@company.com" className="input-field" />
              {errors.email && <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text2)' }}>Password</label>
              <div className="relative">
                <input {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                  type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="input-field pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text3)' }}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text2)' }}>Role</label>
              <select {...register('role')} className="input-field">
                <option value={UserRole.SALES}>Sales User</option>
                <option value={UserRole.ADMIN}>Admin</option>
              </select>
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-60"
              style={{ background: 'var(--accent)' }}>
              {isLoading ? <><Loader2 size={15} className="animate-spin" />Creating account…</> : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm mt-5" style={{ color: 'var(--text3)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)' }} className="font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
