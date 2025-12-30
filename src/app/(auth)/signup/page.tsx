"use client";
// import { SignUpUser } from "@/app/api/Functions/GetUser";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handelChanege = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/singup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword, // 🔴 REQUIRED
          }),
        }
      );

      const data = await res.json(); // ✅ parse response

      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      // ✅ Success
      router.push("/login");
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
          <CardAction>
            <Link href="/login">
              <Button variant="link" className="cursor-pointer">
                Login
              </Button>
            </Link>
          </CardAction>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* Name */}
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handelChanege}
                  type="text"
                  placeholder="Rajat Kumar"
                  required
                />
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  onChange={handelChanege}
                  value={formData.email}
                  placeholder="m@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  onChange={handelChanege}
                  value={formData.password}
                  required
                />
              </div>

              {/* Confirm Password */}
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  onChange={handelChanege}
                  value={formData.confirmPassword}
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <CardFooter className="flex-col mt-5 gap-2">
              <Button type="submit" className="w-full cursor-pointer">
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
              <Button variant="outline" disabled className="w-full">
                Sign up with Google
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
