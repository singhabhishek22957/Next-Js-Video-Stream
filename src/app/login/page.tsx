"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BiHide ,BiShow } from "react-icons/bi";

import { FaEnvelope, FaLock } from "react-icons/fa";
import ThemeToggle from "@/components/themeToggle";

export default function LoginPage() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    startTransition(async () => {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center px-16 bg-surface border-r border-border">
        <h1 className="text-5xl font-bold text-primary">
          StreamFlix
        </h1>

        <p className="mt-4 text-lg  text-muted-foreground">
          Watch trending videos and discover
          premium content from creators around
          the world.
        </p>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="fixed top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md bg-surface border border-border rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">
              Welcome Back
            </h2>

            <p className="mt-2 text-muted-foreground">
              Login to your account
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            {/* Email */}
            <div>
              <label className="block mb-2 text-sm text-muted-foreground">
                Email Address
              </label>

              <div className="flex items-center rounded-xl border border-border bg-background px-4 py-3">
                <FaEnvelope className="text-muted-foreground" />

                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  placeholder="john@example.com"
                  className="ml-3 flex-1 bg-transparent outline-none text-foreground"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-sm text-muted-foreground">
                Password
              </label>

              <div className="flex items-center rounded-xl border border-border bg-background px-4 py-3">
                <FaLock className="text-muted-foreground" />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                  className="ml-3 flex-1 bg-transparent outline-none text-foreground"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="text-primary text-sm"
                >
                  {showPassword
                    ? <BiHide size={20} />
                    :<BiShow size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-500">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary hover:bg-muted-foreground text-white font-semibold py-3 rounded-xl transition"
            >
              {isPending
                ? "Logging In..."
                : "Login"}
            </button>

            <div className="flex justify-between text-sm">
              <Link
                href="/forgot-password"
                className="text-muted-foreground hover:text-primary"
              >
                Forgot Password?
              </Link>

              <span>
                Don&apos;t have an account?
                <Link
                href="/register"
                className=" ml-1 text-muted-foreground hover:text-primary"
              >
                Create Account
              </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}