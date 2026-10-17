import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { registerUser } from "../api/User.api.jsx";
import { setUser } from "../store/slice/authSlice.js";
import { getErrorMessage } from "../utils/helper.js";

const RegisterForm = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const register = useMutation({
    mutationFn: registerUser,
    // Registering also logs the person in, the backend sets the cookie.
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
        register.mutate(form);
      }}
      className="space-y-4"
    >
      <div>
        <label htmlFor="register-name" className="label">
          Name
        </label>
        <input
          id="register-name"
          required
          maxLength={50}
          autoComplete="name"
          className="input"
          value={form.name}
          onChange={update("name")}
        />
      </div>
      <div>
        <label htmlFor="register-email" className="label">
          Email
        </label>
        <input
          id="register-email"
          type="email"
          required
          autoComplete="email"
          className="input"
          value={form.email}
          onChange={update("email")}
        />
      </div>
      <div>
        <label htmlFor="register-password" className="label">
          Password
        </label>
        <input
          id="register-password"
          type="password"
          required
          minLength={8}
          maxLength={128}
          autoComplete="new-password"
          className="input"
          placeholder="At least 8 characters"
          value={form.password}
          onChange={update("password")}
        />
      </div>

      {register.isError && (
        <p role="alert" className="error-text">
          {getErrorMessage(register.error)}
        </p>
      )}

      <button type="submit" className="btn-primary w-full" disabled={register.isPending}>
        {register.isPending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
};

export default RegisterForm;
