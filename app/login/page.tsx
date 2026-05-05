"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AuthShell } from "../components/AuthShell";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login gagal");
      }
      router.push("/");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Login gagal");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        if (data?.user) {
          router.replace('/');
        }
      })
      .catch(() => {});
    return () => { mounted = false };
  }, [router]);

  return (
    <AuthShell
      badge="Masuk"
      title="Selamat datang kembali."
      description="Masuk untuk melihat dashboard, mengelola booking, dan melanjutkan pemesanan venue yang sudah kamu simpan."
      footnote={
        <>
          Belum punya akun? <Link href="/register" className="font-semibold text-[var(--primary)] hover:underline">Daftar sekarang</Link>
        </>
      }
    >
      <div className="rounded-[24px] border border-[var(--border)] bg-white p-5 shadow-[0_18px_40px_rgba(18,24,38,0.08)] sm:p-6">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">Login</p>
          <h2 className="mt-2 text-2xl font-bold text-[var(--foreground)]">Masuk ke akunmu</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-500">Gunakan email dan password yang sudah terdaftar di database.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-[var(--border)] bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)] focus:bg-white"
              placeholder="nama@email.com"
              required
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-[var(--border)] bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)] focus:bg-white"
              placeholder="Minimal 8 karakter"
              required
            />
          </label>

          {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[linear-gradient(135deg,var(--primary),var(--primary-700))] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(181,18,27,0.24)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </div>
    </AuthShell>
  );
}
