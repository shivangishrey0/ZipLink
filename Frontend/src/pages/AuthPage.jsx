import { Link, Navigate, useSearch } from "@tanstack/react-router";
import { useSelector } from "react-redux";
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
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="font-display text-3xl font-bold">
          {isLogin ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-sm text-muted">
          {isLogin ? "Log in to manage your links." : "Free, and your links stay yours."}
        </p>
      </div>

      <div className="card space-y-5">
        {isLogin && error && (
          <p role="alert" className="error-text">
            {GOOGLE_ERRORS[error] ?? "Sign-in did not complete. Please try again."}
          </p>
        )}

        {isLogin ? <LoginForm /> : <RegisterForm />}

        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="h-px flex-1 bg-line" />
          or
          <span className="h-px flex-1 bg-line" />
        </div>

        <GoogleAuthButton />
      </div>

      <p className="text-center text-sm text-muted">
        {isLogin ? "New here? " : "Already have an account? "}
        <Link
          to={isLogin ? "/register" : "/login"}
          className="font-medium text-brand hover:underline"
        >
          {isLogin ? "Create an account" : "Log in"}
        </Link>
      </p>
    </div>
  );
};

export default AuthPage;
