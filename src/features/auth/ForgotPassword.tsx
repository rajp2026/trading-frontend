import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { authService } from "../../core/auth/authservice";

interface ForgotForm {
  email: string;
}

export default function ForgotPasswordPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>();

  const onSubmit = async (data: ForgotForm) => {
    setError("");
    setLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setSuccess(true);
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4">
      {/* Ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            CryptoTrade
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Check your email
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                We've sent a password reset link to your email address.
              </p>
              <Link
                to="/login"
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors text-sm"
              >
                ← Back to login
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-white mb-2">
                Forgot password?
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Enter your email and we'll send you a reset link.
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    Email
                  </label>
                  <input
                    {...register("email", { required: "Email is required" })}
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25 transition-all"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold hover:from-purple-500 hover:to-cyan-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-purple-500/20"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <p className="text-center text-gray-500 text-sm mt-6">
                <Link
                  to="/login"
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  ← Back to login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
