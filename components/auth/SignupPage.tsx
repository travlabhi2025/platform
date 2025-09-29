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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"trip-organizer" | "customer">("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signUp(email, password, name, role);
      router.push("/trip-organizer/dashboard");
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
              Create Account
            </CardTitle>
            <CardDescription className="text-slate-600">
              Join TravlAbhi and start your travel journey
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

              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-700">
                  Account Type
                </Label>
                <RadioGroup
                  value={role}
                  onValueChange={(value) =>
                    setRole(value as "trip-organizer" | "customer")
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="customer" id="customer" />
                    <Label
                      htmlFor="customer"
                      className="text-sm text-slate-600 cursor-pointer"
                    >
                      Customer - Book and travel on trips
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="trip-organizer"
                      id="trip-organizer"
                    />
                    <Label
                      htmlFor="trip-organizer"
                      className="text-sm text-slate-600 cursor-pointer"
                    >
                      Trip Organizer - Create and manage trips
                    </Label>
                  </div>
                </RadioGroup>
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
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-primary hover:text-primary/80 font-medium"
              >
                Sign in
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
