import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loginUser } from "../api/User.api.jsx";
import { setUser } from "../store/slice/authSlice.js";
import { getErrorMessage } from "../utils/helper.js";

const LoginForm = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = useMutation({
    mutationFn: loginUser,
    onSuccess: (user) => {
      dispatch(setUser(user));
      navigate({ to: "/urls" });
    },
  });

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        login.mutate(form);
      }}
      className="space-y-4"
    >
      <div>
        <label htmlFor="login-email" className="label">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          required
          autoComplete="email"
          className="input"
          value={form.email}
          onChange={update("email")}
        />
      </div>
      <div>
        <label htmlFor="login-password" className="label">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          required
          autoComplete="current-password"
          className="input"
          value={form.password}
          onChange={update("password")}
        />
      </div>

      {login.isError && (
        <p role="alert" className="error-text">
          {getErrorMessage(login.error)}
        </p>
      )}

      <button type="submit" className="btn-primary w-full" disabled={login.isPending}>
        {login.isPending ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
};

export default LoginForm;
