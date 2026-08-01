"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  function logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      router.push('/login');
    }
  }

  return (
    <header className="w-full bg-transparent py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
        <Link href="/">
          <a className="text-2xl font-bold">PrepAI</a>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/dashboard">
            <a className="text-sm">Dashboard</a>
          </Link>
          <Link href="/login">
            <a className="text-sm">Login</a>
          </Link>
          <Link href="/signup">
            <a className="text-sm">Sign up</a>
          </Link>
          <button onClick={logout} className="text-sm text-red-400">
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
