"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function OrganizerSignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const role = "trip-organizer"; // Fixed to trip-organizer role
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signUp(email, password, name, role);

      // User profile is now immediately available, redirect to home
      router.push("/");
    } catch (err: unknown) {
      setError((err as Error).message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithGoogle(role);
      router.push("/");
    } catch (err: unknown) {
      setError((err as Error).message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative h-screen w-screen bg-gradient-to-br from-orange-100 to-orange-200">
      {" "}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/home/TravelAbhiHero.png"
          alt="Travel Adventure"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-black/10"></div>
      </div>
      <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">T</span>
              </div>
            </div>
            <CardTitle className="text-2xl font-garetheavy text-primary">
              Create Organizer Account
            </CardTitle>
            <CardDescription className="text-slate-600">
              Join TravlAbhi and start organizing amazing trips
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-slate-700"
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-11"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                  placeholder="Create a password"
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium"
              >
                {loading ? "Creating Account..." : "Create Organizer Account"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              className="w-full h-11 bg-white border text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2"
              aria-label="Continue with Google"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="h-5 w-5"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C33.337,6.053,28.884,4,24,4C12.955,4,4,12.955,4,24 s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.297,16.104,18.839,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657 C33.337,6.053,28.884,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c4.774,0,9.154-1.826,12.477-4.807l-5.769-4.869C28.718,35.99,26.486,36.8,24,36.8 c-5.202,0-9.619-3.317-11.278-7.946l-6.54,5.036C9.5,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-3.977,5.586 c0.001-0.001,0.002-0.001,0.003-0.002l5.769,4.869C36.771,39.279,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              Continue with Google
            </Button>
            <div className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-primary hover:text-primary/80 font-medium"
              >
                Sign in
              </Link>
            </div>

            <div className="text-center text-sm text-slate-600">
              Looking to book trips instead?{" "}
              <Link
                href="/signup"
                className="text-primary hover:text-primary/80 font-medium"
              >
                Sign up as Customer
              </Link>
            </div>

            <div className="text-center">
              <Link
                href="/"
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                ← Back to Home
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
