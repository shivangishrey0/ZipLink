import { Link, Navigate, useSearch } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import AuthLayout from "../components/auth/AuthLayout.jsx";
import LoginForm from "../components/LoginForm.jsx";
import RegisterForm from "../components/RegisterForm.jsx";
import GoogleAuthButton from "../components/GoogleAuthButton.jsx";

// The backend sends people back to /login?error=<code> when Google sign-in does not complete.
const GOOGLE_ERRORS = {
  invalid_state: "The Google sign-in session expired. Please try again.",
  google_failed: "Google sign-in did not complete. Please try again.",
  email_registered:
    "This email already has a password account. Log in with your email and password instead.",
  email_not_verified: "Google did not confirm that email address, so it cannot be used.",
};

const AuthPage = ({ mode }) => {
  const user = useSelector((state) => state.auth.user);
  const { error } = useSearch({ strict: false });
  const isLogin = mode === "login";

  if (user) {
    return <Navigate to="/urls" />;
  }

  return (
    <AuthLayout>
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
          {isLogin ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-2.5 text-base leading-relaxed text-muted">
          {isLogin
            ? "Log in to manage your links and see how they perform."
            : "Start creating short links and tracking their clicks."}
        </p>
      </div>

      {isLogin && error && (
        <p role="alert" className="error-text mt-6">
          {GOOGLE_ERRORS[error] ?? "Sign-in did not complete. Please try again."}
        </p>
      )}

      <div className="mt-8 space-y-6">
        <GoogleAuthButton />

        <div className="flex items-center gap-3 text-xs text-faint">
          <span className="h-px flex-1 bg-white/10" />
          or continue with email
          <span className="h-px flex-1 bg-white/10" />
        </div>

        {isLogin ? <LoginForm /> : <RegisterForm />}
      </div>

      <p className="mt-8 text-center text-sm text-muted">
        {isLogin ? "New to ZipLink? " : "Already have an account? "}
        <Link
          to={isLogin ? "/register" : "/login"}
          className="font-semibold text-brand-text transition hover:text-white"
        >
          {isLogin ? "Create an account" : "Log in"}
        </Link>
      </p>
    </AuthLayout>
  );
};

export default AuthPage;
