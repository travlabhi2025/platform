"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  X,
} from "lucide-react";
import PhoneInput from "./PhoneInput";

function SignupPageContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signUp, signInWithGoogle, user, userProfile, loading: authLoading } =
    useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  // Handle phone input with parts
  const handlePhoneChangeWithParts = useCallback((parts: { countryCode: string; phoneNumber: string; fullValue: string }) => {
    setCountryCode(parts.countryCode);
    setPhoneNumber(parts.phoneNumber);
    setPhone(parts.fullValue);
  }, []);

  // Simple password validation flags
  const [validations, setValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    setValidations({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
    });
  }, [password]);

  // Check if user is logged in (from any auth method including OAuth redirect)
  useEffect(() => {
    if (authLoading) return;

    if (user && userProfile) {
      const finalRedirect = redirectUrl || "/dashboard";
      router.push(decodeURIComponent(finalRedirect));
    }
  }, [user, userProfile, router, redirectUrl, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const isValid = Object.values(validations).every(Boolean);
    if (!isValid) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      setLoading(false);
      return;
    }

    try {
      // Use phoneNumber and countryCode if available, otherwise fallback to phone parsing
      const phoneToSend: string | undefined = phoneNumber && countryCode 
        ? `${countryCode} ${phoneNumber}` 
        : phone || undefined;
      await signUp(email, password, name, phoneToSend);
      // Redirect will be handled by useEffect
    } catch (err: unknown) {
      setError((err as Error).message || "An error occurred");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await signInWithGoogle();

      if (result.firebaseUser && result.userProfile) {
        let attempts = 0;
        const maxAttempts = 20;
        while (attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          attempts++;
          if (attempts >= 5) {
            break;
          }
        }

        const finalRedirect = redirectUrl || "/dashboard";
        router.push(decodeURIComponent(finalRedirect));
      } else {
        setError("Failed to sign up with Google. Please try again.");
      }
    } catch (error: unknown) {
      console.error("[signup] ❌ OAuth error:", error);
      setError("Failed to sign up with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="bg-background-light min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-slate-600 font-satoshi">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-light font-display text-primary min-h-screen flex flex-col items-center justify-center relative overflow-x-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-slate-50 to-transparent -z-10"></div>
      <div className="absolute right-[10%] top-[5%] w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute left-[10%] bottom-[10%] w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4 py-8 flex flex-col items-center max-w-lg w-full">
        {/* Logo */}
        <div className="text-center mb-6 animate-fade-in-down">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <Image
              src="/images/logos/TripAbhiDark.svg"
              alt="TripAbhi"
              width={120}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </div>
          <h1 className="text-sm md:text-base font-bold text-slate-600 tracking-tight font-satoshi-bold">
            Travel with people, not packages
          </h1>
        </div>

        {/* Signup card */}
        <div className="w-full bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden relative flex flex-col">
          {/* Form content */}
          <div className="p-6 md:p-8 flex-1 flex flex-col">
            <div className="mb-6 text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-bold text-primary mb-1.5 font-satoshi-bold">
                Join the Community
              </h2>
              <p className="text-slate-500 font-medium text-sm font-satoshi">
                Create your account to start exploring.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Full Name field */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-primary uppercase tracking-wider ml-1 font-satoshi-bold">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-slate-400 group-focus-within:text-accent transition-colors" />
                  </div>
                  <input
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border-transparent rounded-xl text-primary text-sm placeholder:text-slate-400 focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-100 transition-all font-semibold font-body tracking-[0.05em]"
                    placeholder="Ex. Alex Traveler"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email field */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-primary uppercase tracking-wider ml-1 font-satoshi-bold">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-accent transition-colors" />
                  </div>
                  <input
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border-transparent rounded-xl text-primary text-sm placeholder:text-slate-400 focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-100 transition-all font-semibold font-body tracking-[0.05em]"
                    placeholder="hello@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Phone Number field */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-primary uppercase tracking-wider ml-1 font-satoshi-bold">
                  Phone Number
                </label>
                <PhoneInput
                  value={phone}
                  onChange={setPhone}
                  onChangeWithParts={handlePhoneChangeWithParts}
                  disabled={loading}
                  placeholder="000-0000"
                  required
                />
              </div>

              {/* Password field */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-primary uppercase tracking-wider ml-1 font-satoshi-bold">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-accent transition-colors" />
                  </div>
                  <input
                    className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border-transparent rounded-xl text-primary text-sm placeholder:text-slate-400 focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-100 transition-all font-semibold font-body tracking-[0.05em]"
                    placeholder="Create a password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-primary transition-colors"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="text-red-600 text-xs bg-red-50 p-2.5 rounded-xl border border-red-200 flex items-start gap-2 font-satoshi">
                  <X className="h-3 w-3 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded-xl shadow-xl shadow-primary/10 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group text-sm font-satoshi-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? "Creating Account..." : "Create Account"}
                <ArrowRight className="w-[18px] h-[18px] group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Divider */}
            <div className="relative mt-6 mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white px-2 text-slate-400 font-bold tracking-widest font-satoshi-bold">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google OAuth button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-1.5 px-4 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed font-satoshi-medium flex items-center justify-center gap-2"
              title="Sign in with Google"
            >
              <span className="font-bold text-lg">G</span>
              <span>Continue with Google</span>
            </button>

            {/* Sign in link */}
            <div className="mt-6 pt-4 border-t border-slate-50 text-center">
              <p className="text-xs text-slate-500 font-medium font-satoshi">
                Already have an account?{" "}
                <Link
                  className="text-accent-dark hover:text-primary font-bold ml-1 hover:underline underline-offset-2 decoration-2 decoration-accent/30 transition-all font-satoshi-bold"
                  href="/signin"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom gradient bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent-dark to-accent"></div>
        </div>

        {/* Footer links */}
        <div className="mt-6 flex gap-6 text-xs text-slate-400 font-medium font-satoshi">
          <Link className="hover:text-primary transition-colors" href="#">
            Privacy
          </Link>
          <span className="w-0.5 h-0.5 rounded-full bg-slate-300 self-center"></span>
          <Link
            className="hover:text-primary transition-colors"
            href="/terms-and-conditions"
          >
            Terms
          </Link>
          <span className="w-0.5 h-0.5 rounded-full bg-slate-300 self-center"></span>
          <Link className="hover:text-primary transition-colors" href="#">
            Help
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupPageContent />
    </Suspense>
  );
}
