'use client';

import { useState, useTransition } from 'react';
import { signInWithGoogle } from '@/app/actions';
import { Button } from '@/components/ui/button';

export default function GoogleSignInButton() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = () => {
    startTransition(async () => {
      try {
        await signInWithGoogle();
      } catch (err) {
        setError('Google 登录失败，请重试');
      }
    });
  };

  return (
    <div className="mt-4">
      <Button
        variant="outline"
        className="w-full"
        onClick={handleGoogleLogin}
        disabled={isPending}
      >
        {isPending ? '加载中...' : '使用 Google 登录'}
      </Button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}