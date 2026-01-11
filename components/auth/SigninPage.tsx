"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogIn,
  MessageSquare,
  X,
  Loader2,
} from "lucide-react";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/lib/firebase";

function SigninPageContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">(
    "password"
  );
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendTimer, setResendTimer] = useState(0); // Timer in seconds
  const [resendingOtp, setResendingOtp] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    signIn,
    signInWithGoogle,
    waitForUserProfile,
    user,
    userProfile,
    loading: authLoading,
  } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  // Check if user is logged in
  useEffect(() => {
    if (authLoading) return;

    if (user && userProfile) {
      const finalRedirect = redirectUrl || "/dashboard";
      router.push(decodeURIComponent(finalRedirect));
    }
  }, [user, userProfile, router, redirectUrl, authLoading]);

  // Reset OTP state when switching methods
  useEffect(() => {
    if (loginMethod === "password") {
      setOtpSent(false);
      setOtp(["", "", "", "", "", ""]);
      setError("");
      setSuccess("");
      setResendTimer(0);
    }
  }, [loginMethod]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || "";
    }
    setOtp(newOtp);
    // Focus the last input or next empty input
    const nextEmptyIndex = newOtp.findIndex((val) => !val);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    otpInputRefs.current[focusIndex]?.focus();
  };

  const handleGenerateOtp = async (isResend: boolean = false) => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (isResend && resendTimer > 0) {
      return; // Prevent resend if timer is still active
    }

    if (isResend) {
      setResendingOtp(true);
    } else {
      setSendingOtp(true);
    }
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/check-email-and-send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send OTP");
        // If rate limited, don't reset timer
        if (response.status === 429 && data.resetAt) {
          const resetTime = new Date(data.resetAt).getTime();
          const now = Date.now();
          const secondsUntilReset = Math.ceil((resetTime - now) / 1000);
          if (secondsUntilReset > 0) {
            setResendTimer(Math.min(secondsUntilReset, 60)); // Cap at 60 seconds for display
          }
        }
        return;
      }

      setSuccess(data.message || "OTP sent successfully!");
      setOtpSent(true);
      setResendTimer(60); // Start 1 minute timer

      // Focus first OTP input
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setSendingOtp(false);
      setResendingOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (loginMethod === "password") {
        await signIn(email, password);
        await waitForUserProfile();

        if (redirectUrl) {
          router.push(decodeURIComponent(redirectUrl));
        } else {
          router.push("/dashboard");
        }
      } else {
        // OTP login
        const otpString = otp.join("");
        if (otpString.length !== 6) {
          setError("Please enter the complete 6-digit OTP");
          setLoading(false);
          return;
        }

        const response = await fetch("/api/auth/verify-otp-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: otpString }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.code === "ORGANISER_ACCESS_DENIED") {
            setError("Organiser accounts cannot access the customer platform. Please use the organiser portal.");
          } else {
            setError(data.error || "Invalid OTP");
          }
          setLoading(false);
          return;
        }

        // OTP verified successfully - sign in with custom token
        if (!data.customToken) {
          setError("Authentication token not received. Please try again.");
          setLoading(false);
          return;
        }

        // Sign in with custom token
        const userCredential = await signInWithCustomToken(
          auth,
          data.customToken
        );

        // Wait for user profile to load
        await waitForUserProfile();

        // Redirect to dashboard
        const finalRedirect = redirectUrl || "/dashboard";
        router.push(decodeURIComponent(finalRedirect));
      }
    } catch (err: unknown) {
      if (loginMethod === "password") {
        setError("Incorrect email or password. Please try again.");
      } else {
        setError("Failed to verify OTP. Please try again.");
      }
    } finally {
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
        setError("Failed to sign in with Google. Please try again.");
      }
    } catch (error: unknown) {
      console.error("[signin] ❌ OAuth error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to sign in with Google. Please try again.";
      if (errorMessage.includes("Organiser accounts cannot access")) {
        setError("Organiser accounts cannot access the customer platform. Please use the organiser portal.");
      } else {
        setError(errorMessage);
      }
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

      <div className="container mx-auto px-4 py-6 flex flex-col items-center max-w-lg">
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

        {/* Login card */}
        <div className="w-full bg-white rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden relative flex flex-col">
          {/* Login method toggle */}
          <div className="px-5 pt-5 pb-0">
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 relative">
              <button
                onClick={() => setLoginMethod("password")}
                className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 font-satoshi-bold ${
                  loginMethod === "password"
                    ? "bg-white text-primary shadow-sm border-slate-100/50 z-10"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 font-satoshi-medium"
                }`}
              >
                <Lock className="w-4 h-4" />
                Password
              </button>
              <button
                onClick={() => setLoginMethod("otp")}
                className={`flex-1 py-2 px-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 font-satoshi-medium ${
                  loginMethod === "otp"
                    ? "bg-white text-primary shadow-sm border border-slate-100/50 z-10 font-satoshi-bold"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                OTP
              </button>
            </div>
          </div>

          {/* Form content */}
          <div className="p-6 pt-5 flex-1 flex flex-col">
            <div className="mb-5 text-center">
              <h2 className="text-xl font-bold text-primary mb-0.5 font-satoshi-bold">
                Welcome back, Traveler
              </h2>
              <p className="text-slate-500 text-xs font-medium font-satoshi">
                Log in to access your marketplace.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border-transparent rounded-xl text-primary text-sm placeholder:text-slate-400 focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-100 transition-all font-semibold font-body "
                    placeholder="hello@tripabhi.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading || sendingOtp}
                  />
                </div>
              </div>

              {/* Password field */}
              {loginMethod === "password" && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[11px] font-bold text-primary uppercase tracking-wider font-satoshi-bold">
                      Password
                    </label>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-accent transition-colors" />
                    </div>
                    <input
                      className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border-transparent rounded-xl text-primary text-sm placeholder:text-slate-400 focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-100 transition-all font-semibold font-body "
                      placeholder="••••••••"
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
                  <div className="flex justify-end mt-0.5">
                    <button
                      className="text-[11px] font-bold text-accent-dark hover:text-primary transition-colors font-satoshi-bold"
                      onClick={() => setLoginMethod("otp")}
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>
              )}

              {/* OTP field */}
              {loginMethod === "otp" && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-primary uppercase tracking-wider ml-1 font-satoshi-bold">
                    Verification Code
                  </label>
                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={() => handleGenerateOtp(false)}
                      disabled={sendingOtp || !email}
                      className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-primary hover:bg-slate-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-satoshi-medium flex items-center justify-center gap-2"
                    >
                      {sendingOtp ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send OTP"
                      )}
                    </button>
                  ) : (
                    <div className="flex gap-2" onPaste={handlePaste}>
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el: HTMLInputElement | null) => {
                            otpInputRefs.current[index] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-full h-12 text-center text-lg font-bold border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body "
                          disabled={loading}
                        />
                      ))}
                    </div>
                  )}
                  {otpSent && (
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => handleGenerateOtp(true)}
                        disabled={resendTimer > 0 || resendingOtp}
                        className="text-[11px] font-bold text-accent-dark hover:text-primary transition-colors font-satoshi-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        {resendingOtp ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Resending...
                          </>
                        ) : resendTimer > 0 ? (
                          `Resend OTP (${resendTimer}s)`
                        ) : (
                          "Resend OTP"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Success message */}
              {success && (
                <div className="text-green-600 text-xs bg-green-50 p-2.5 rounded-xl border border-green-200 flex items-start gap-2 font-satoshi">
                  <span>{success}</span>
                </div>
              )}

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
                disabled={loading || (loginMethod === "otp" && !otpSent)}
                className="mt-1 w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl shadow-xl shadow-primary/10 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group text-sm font-satoshi-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? "Signing In..." : "Login"}
                <LogIn className="w-[18px] h-[18px] group-hover:translate-x-1 transition-transform" />
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

            {/* Sign up link */}
            <div className="mt-6 pt-4 border-t border-slate-50 text-center">
              <p className="text-xs text-slate-500 font-medium font-satoshi">
                Don't have an account?{" "}
                <Link
                  className="text-accent-dark hover:text-primary font-bold ml-1 hover:underline underline-offset-2 decoration-2 decoration-accent/30 transition-all font-satoshi-bold"
                  href="/signup"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom gradient bar */}
          <div className="h-1 w-full bg-gradient-to-r from-primary via-accent-dark to-accent"></div>
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

export default function SigninPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SigninPageContent />
    </Suspense>
  );
}
