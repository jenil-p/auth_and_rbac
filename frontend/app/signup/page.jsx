"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authService } from "@/api/auth.service.js";

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ fullname: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await authService.signup(formData);
            toast.success(res.data.message);

            router.push("/login");
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-950 font-sans">
            <div className="w-full max-w-sm p-6 bg-neutral-900/50 border border-neutral-800 rounded-lg shadow-xl">
                <h1 className="text-xl font-medium text-neutral-200 mb-6 text-center">Create Account</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs text-neutral-500 mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-1.5 text-sm bg-neutral-900 border border-neutral-800 rounded text-neutral-200 focus:outline-none focus:border-neutral-600 transition-colors"
                            value={formData.fullname}
                            onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-neutral-500 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-3 py-1.5 text-sm bg-neutral-900 border border-neutral-800 rounded text-neutral-200 focus:outline-none focus:border-neutral-600 transition-colors"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-neutral-500 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-3 py-1.5 text-sm bg-neutral-900 border border-neutral-800 rounded text-neutral-200 focus:outline-none focus:border-neutral-600 transition-colors"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 px-3 py-1.5 text-sm bg-neutral-200 hover:bg-neutral-300 text-neutral-900 font-medium rounded transition-colors disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Sign Up"}
                    </button>
                </form>

                <p className="mt-6 text-center text-xs text-neutral-500">
                    Already have an account?{" "}
                    <Link href="/login" className="text-neutral-300 hover:text-white transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}