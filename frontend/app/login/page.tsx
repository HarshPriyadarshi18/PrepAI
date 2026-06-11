"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const res = await fetch(`${apiBase}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || "Login failed")

      // store token for dev auth fallback (when cookies are blocked)
      if (data.token) {
        try {
          localStorage.setItem("token", data.token)
        } catch (e) {}
      }

      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <form onSubmit={handleSubmit} style={{ width: 360, padding: 32, border: "1px solid #e5e7eb", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <h1 style={{ marginBottom: 16, fontSize: 24 }}>Sign in</h1>
        {error && <div style={{ color: "#b91c1c", marginBottom: 12 }}>{error}</div>}

        <label style={{ display: "block", marginBottom: 8 }}>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          style={{ width: "100%", padding: 8, marginBottom: 12, borderRadius: 4, border: "1px solid #d1d5db" }}
        />

        <label style={{ display: "block", marginBottom: 8 }}>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          style={{ width: "100%", padding: 8, marginBottom: 16, borderRadius: 4, border: "1px solid #d1d5db" }}
        />

        <button type="submit" disabled={loading} style={{ width: "100%", padding: 10, backgroundColor: "#111827", color: "#fff", borderRadius: 4, border: "none" }}>
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <div style={{ marginTop: 12, textAlign: "center" }}>
          <a href="/signup" style={{ color: "#3b82f6" }}>Don't have an account? Sign up</a>
        </div>
      </form>
    </div>
  )
}
