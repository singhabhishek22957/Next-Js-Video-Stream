"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  FaUser,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";

import { toast } from "sonner";

import ThemeToggle from "@/components/themeToggle";
import { registerAction } from "@/features/auth/actions/userCRUD.action";

export default function RegisterPage() {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
    });

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (
      formData.password !==
      confirmPassword
    ) {
      toast.error(
        "Passwords do not match"
      );
      return;
    }

    startTransition(async () => {
      const result =
        await registerAction(
          formData
        );

      if (!result.success) {
        toast.error(
          result.message ||
            "Registration failed"
        );

        return;
      }

      toast.success(
        result.message ||
          "Account created successfully"
      );

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* LEFT SIDE */}
      

      {/* RIGHT SIDE */}
      <div
        className="
          flex-1

          flex
          items-center
          justify-center

          p-4
          md:p-8
        "
      >
        {/* Theme Toggle */}
        <div className="fixed top-4 right-4">
          <ThemeToggle />
        </div>

        <div
          className="
            w-full
            max-w-md

            rounded-3xl

            border
            border-border

            bg-surface

            p-6
            md:p-8

            shadow-xl
          "
        >
          <div className="text-center">
            <h2
              className="
                text-3xl
                font-bold

                text-foreground
              "
            >
              Create Account
            </h2>

            <p
              className="
                mt-2

                text-muted-foreground
              "
            >
              Start your streaming
              journey today
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="
              mt-8
              space-y-5
            "
          >
            {/* Name */}
            <div>
              <label
                className="
                  mb-2
                  block

                  text-sm

                  text-muted-foreground
                "
              >
                Full Name
              </label>

              <div
                className="
                  flex
                  items-center

                  rounded-xl

                  border
                  border-border

                  bg-background

                  px-4
                  py-3
                "
              >
                <FaUser className="text-muted-foreground" />

                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name:
                        e.target.value,
                    })
                  }
                  placeholder="John Doe"
                  className="
                    ml-3
                    flex-1

                    bg-transparent

                    outline-none
                  "
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                className="
                  mb-2
                  block

                  text-sm

                  text-muted-foreground
                "
              >
                Email Address
              </label>

              <div
                className="
                  flex
                  items-center

                  rounded-xl

                  border
                  border-border

                  bg-background

                  px-4
                  py-3
                "
              >
                <FaEnvelope className="text-muted-foreground" />

                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email:
                        e.target.value,
                    })
                  }
                  placeholder="john@example.com"
                  className="
                    ml-3
                    flex-1

                    bg-transparent

                    outline-none
                  "
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className="
                  mb-2
                  block

                  text-sm

                  text-muted-foreground
                "
              >
                Password
              </label>

              <div
                className="
                  flex
                  items-center

                  rounded-xl

                  border
                  border-border

                  bg-background

                  px-4
                  py-3
                "
              >
                <FaLock className="text-muted-foreground" />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  required
                  value={
                    formData.password
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password:
                        e.target.value,
                    })
                  }
                  placeholder="••••••••"
                  className="
                    ml-3
                    flex-1

                    bg-transparent

                    outline-none
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="
                    text-primary
                    text-sm
                  "
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>
              </div>

              <p
                className="
                  mt-2

                  text-xs

                  text-muted-foreground
                "
              >
                At least 8 characters,
                one uppercase letter,
                one lowercase letter
                and one number.
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                className="
                  mb-2
                  block

                  text-sm

                  text-muted-foreground
                "
              >
                Confirm Password
              </label>

              <div
                className="
                  flex
                  items-center

                  rounded-xl

                  border
                  border-border

                  bg-background

                  px-4
                  py-3
                "
              >
                <FaLock className="text-muted-foreground" />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  required
                  value={
                    confirmPassword
                  }
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="••••••••"
                  className="
                    ml-3
                    flex-1

                    bg-transparent

                    outline-none
                  "
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="
                w-full

                rounded-xl

                bg-primary

                py-3

                font-semibold

                text-primary-foreground

                transition-all

                hover:bg-secondary

                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="
                      h-4
                      w-4

                      animate-spin

                      rounded-full

                      border-2
                      border-white

                      border-t-transparent
                    "
                  />
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            <p
              className="
                text-center
                text-sm

                text-muted-foreground
              "
            >
              Already have an account?{" "}
              <Link
                href="/login"
                className="
                  font-medium
                  text-primary
                "
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}