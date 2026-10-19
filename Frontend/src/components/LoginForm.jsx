import { useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { loginUser } from "../api/User.api.jsx";
import { setUser } from "../store/slice/authSlice.js";
import { getErrorMessage } from "../utils/helper.js";
import PasswordInput from "./auth/PasswordInput.jsx";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = ({ email, password }) => {
  const errors = {};
  if (!email.trim()) errors.email = "Enter your email address.";
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = "Enter a valid email address.";
  if (!password) errors.password = "Enter your password.";
  return errors;
};

const LoginForm = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({});
  const emailInput = useRef(null);
  const passwordInput = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const errors = validate(form);
  const shown = (field) => (touched[field] ? errors[field] : undefined);

  const login = useMutation({
    mutationFn: loginUser,
    onSuccess: (user) => {
      dispatch(setUser(user));
      navigate({ to: "/urls" });
    },
  });

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });
  const blur = (field) => () => setTouched({ ...touched, [field]: true });

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched({ email: true, password: true });

    if (errors.email) return emailInput.current?.focus();
    if (errors.password) return passwordInput.current?.focus();

    // The request body is unchanged: just the email and the password.
    login.mutate(form);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="login-email" className="label">
          Email
        </label>
        <input
          ref={emailInput}
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={`input ${shown("email") ? "border-danger/60" : ""}`}
          value={form.email}
          onChange={update("email")}
          onBlur={blur("email")}
          aria-invalid={Boolean(shown("email"))}
          aria-describedby={shown("email") ? "login-email-error" : undefined}
        />
        {shown("email") && (
          <p id="login-email-error" className="field-error">
            {shown("email")}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="login-password" className="label">
          Password
        </label>
        <PasswordInput
          ref={passwordInput}
          id="login-password"
          autoComplete="current-password"
          placeholder="Your password"
          value={form.password}
          onChange={update("password")}
          onBlur={blur("password")}
          invalid={Boolean(shown("password"))}
          aria-describedby={shown("password") ? "login-password-error" : undefined}
        />
        {shown("password") && (
          <p id="login-password-error" className="field-error">
            {shown("password")}
          </p>
        )}
      </div>

      {login.isError && (
        <p role="alert" className="error-text">
          {getErrorMessage(login.error)}
        </p>
      )}

      <button type="submit" className="btn-primary h-11 w-full" disabled={login.isPending}>
        {login.isPending ? (
          <>
            <LoaderCircle size={17} className="animate-spin" aria-hidden="true" />
            Logging in
          </>
        ) : (
          <>
            Log in
            <ArrowRight size={17} aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
};

export default LoginForm;
