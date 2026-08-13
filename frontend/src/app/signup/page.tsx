"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/signup', { name, email, password });
      const token = res.data?.token;
      if (!token) throw new Error('No token returned');
      localStorage.setItem('token', token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto glass p-6 rounded-lg shadow-lg mt-12">
      <h1 className="text-2xl font-semibold mb-4">Sign Up</h1>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-3 rounded bg-transparent border border-gray-700"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full p-3 rounded bg-transparent border border-gray-700"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-3 rounded bg-transparent border border-gray-700"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full p-3 bg-green-600 rounded hover:bg-green-500" disabled={loading}>
          {loading ? 'Signing up…' : 'Create account'}
        </button>
      </form>
    </div>
  );
}
