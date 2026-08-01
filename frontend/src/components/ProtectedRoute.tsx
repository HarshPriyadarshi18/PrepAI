"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <div className="p-6">Checking authentication…</div>;
  return <>{children}</>;
}
