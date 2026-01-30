"use client";

import { trpc } from "@/lib/trpc";
import { emailSchema } from "@/lib/validation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { z } from "zod";

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      // Store token
      localStorage.setItem("token", data.token);
      document.cookie = `token=${data.token}; path=/; max-age=86400`; // 1 day

      // Redirect to dashboard (dispatcher will handle roles)
      router.push("/dashboard");
    },
    onError: (err) => {
      setError(err.message || "Giriş başarısız oldu. Lütfen tekrar deneyin.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      loginSchema.parse({ email, password });
      loginMutation.mutate({ email, password });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1A237E] mb-2">Apartman Plus</h1>
          <p className="text-gray-600">Yönetim Paneline Giriş</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100 flex items-center gap-2">
              ⚠️ {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              E-posta Adresi
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E] focus:border-transparent transition-all"
              placeholder="admin@example.com"
              required
            />
           </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E] focus:border-transparent transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-[#1A237E] text-white py-3.5 rounded-lg font-medium hover:bg-[#151b60] disabled:opacity-70 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-900/20"
          >
            {loginMutation.isPending ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Hesabınız yok mu?{" "}
          <Link href="/register" className="text-[#2ECC71] font-semibold hover:underline">
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  );
}
