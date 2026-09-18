'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await loginAdmin(email, password);
      router.push('/packages');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center -mt-8 px-4">
      <div className="bg-white p-8 sm:p-10 rounded-[28px] shadow-[0_12px_40px_rgba(11,28,48,0.06)] border border-[#EBE4D8] w-full max-w-md relative overflow-hidden">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF7A45] via-[#FF6433] to-[#E84A23] flex items-center justify-center text-white font-extrabold shadow-[0_8px_20px_rgba(232,74,35,0.35)] mx-auto mb-4 text-xl border border-white/30 relative overflow-hidden">
            <span className="relative z-10">IM</span>
            <div className="absolute inset-x-0 top-0 h-1/2 bg-white/20 pointer-events-none rounded-t-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-[#0B1C30] tracking-tight">Studio Portal</h1>
          <p className="text-xs text-[#8C8880] mt-1.5 font-medium">Sign in with your administrator credentials</p>
        </div>

        {error && (
          <div className="bg-[#FFF1F2] text-[#E11D48] text-xs font-semibold p-3.5 rounded-xl mb-6 border border-[#FFE4E6]">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-[#8C8880] uppercase tracking-wider mb-1.5">Email Address</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@islandmonkey.com"
              required
              className="bg-[#FAF6F0] border-[#E8E1D5] rounded-xl h-11 text-sm font-medium text-[#0B1C30] focus:border-[#C85A17] focus:ring-[#C85A17]/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#8C8880] uppercase tracking-wider mb-1.5">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-[#FAF6F0] border-[#E8E1D5] rounded-xl h-11 text-sm font-medium text-[#0B1C30] focus:border-[#C85A17] focus:ring-[#C85A17]/20"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full im-btn-specular h-12 font-bold text-sm rounded-xl mt-4 cursor-pointer"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
}
