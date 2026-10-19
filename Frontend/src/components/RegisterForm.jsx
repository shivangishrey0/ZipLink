import { useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { registerUser } from "../api/User.api.jsx";
import { setUser } from "../store/slice/authSlice.js";
import { getErrorMessage } from "../utils/helper.js";
import PasswordInput from "./auth/PasswordInput.jsx";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The same limits the server enforces: name 1 to 50 characters, password 8 to 128.
const validate = ({ name, email, password }) => {
  const errors = {};
  if (!name.trim()) errors.name = "Enter your name.";
  else if (name.trim().length > 50) errors.name = "Use 50 characters or fewer.";
  if (!email.trim()) errors.email = "Enter your email address.";
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = "Enter a valid email address.";
  if (password.length < 8) errors.password = "Use at least 8 characters.";
  else if (password.length > 128) errors.password = "Use 128 characters or fewer.";
  return errors;
};

const RegisterForm = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [touched, setTouched] = useState({});
  const refs = { name: useRef(null), email: useRef(null), password: useRef(null) };
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const errors = validate(form);
  const shown = (field) => (touched[field] ? errors[field] : undefined);
  const longEnough = form.password.length >= 8 && form.password.length <= 128;

  const register = useMutation({
    mutationFn: registerUser,
    // Registering also logs the person in, the backend sets the cookie.
    onSuccess: (user) => {
      dispatch(setUser(user));
      navigate({ to: "/urls" });
    },
  });

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });
  const blur = (field) => () => setTouched({ ...touched, [field]: true });

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched({ name: true, email: true, password: true });

    const first = ["name", "email", "password"].find((field) => errors[field]);
    if (first) return refs[first].current?.focus();

    // The request body is unchanged: name, email and password.
    register.mutate(form);
  };

  const invalid = (field) => (shown(field) ? "border-danger/60" : "");

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="register-name" className="label">
          Name
        </label>
        <input
          ref={refs.name}
          id="register-name"
          autoComplete="name"
          placeholder="Your name"
          className={`input ${invalid("name")}`}
          value={form.name}
          onChange={update("name")}
          onBlur={blur("name")}
          aria-invalid={Boolean(shown("name"))}
          aria-describedby={shown("name") ? "register-name-error" : undefined}
        />
        {shown("name") && (
          <p id="register-name-error" className="field-error">
            {shown("name")}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="register-email" className="label">
          Email
        </label>
        <input
          ref={refs.email}
          id="register-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={`input ${invalid("email")}`}
          value={form.email}
          onChange={update("email")}
          onBlur={blur("email")}
          aria-invalid={Boolean(shown("email"))}
          aria-describedby={shown("email") ? "register-email-error" : undefined}
        />
        {shown("email") && (
          <p id="register-email-error" className="field-error">
            {shown("email")}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="register-password" className="label">
          Password
        </label>
        <PasswordInput
          ref={refs.password}
          id="register-password"
          autoComplete="new-password"
          placeholder="Create a password"
          value={form.password}
          onChange={update("password")}
          onBlur={blur("password")}
          invalid={Boolean(shown("password"))}
          aria-describedby="register-password-hint"
        />
        <p
          id="register-password-hint"
          role={shown("password") ? "alert" : undefined}
          className={`mt-2 flex items-center gap-1.5 text-xs transition-colors ${
            longEnough ? "text-success" : shown("password") ? "text-danger" : "text-faint"
          }`}
        >
          <Check size={13} aria-hidden="true" className={longEnough ? "opacity-100" : "opacity-40"} />
          {shown("password") ?? "At least 8 characters"}
        </p>
      </div>

      {register.isError && (
        <p role="alert" className="error-text">
          {getErrorMessage(register.error)}
        </p>
      )}

      <button type="submit" className="btn-primary h-11 w-full" disabled={register.isPending}>
        {register.isPending ? (
          <>
            <LoaderCircle size={17} className="animate-spin" aria-hidden="true" />
            Creating account
          </>
        ) : (
          <>
            Create account
            <ArrowRight size={17} aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
};

export default RegisterForm;
