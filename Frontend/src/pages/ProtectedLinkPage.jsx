import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Lock } from "lucide-react";
import { unlockUrl } from "../api/ShortUrl.api.jsx";
import { getErrorMessage } from "../utils/helper.js";

// The backend redirects visitors here for password protected links: /protected/<short code>.
const ProtectedLinkPage = () => {
  const { code } = useParams({ strict: false });
  const [password, setPassword] = useState("");

  const unlock = useMutation({
    mutationFn: () => unlockUrl(code, password),
    // The server only answers with the destination after the password matched.
    onSuccess: (url) => window.location.assign(url),
  });

  return (
    <div className="mx-auto max-w-md space-y-6 py-8">
      <div className="space-y-3 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-soft text-brand">
          <Lock aria-hidden="true" />
        </span>
        <h1 className="font-display text-3xl font-bold">This link is protected</h1>
        <p className="text-muted">Enter the password the owner gave you to continue.</p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          unlock.mutate();
        }}
        className="card space-y-4"
      >
        <div>
          <label htmlFor="unlock-password" className="label">
            Password
          </label>
          <input
            id="unlock-password"
            type="password"
            required
            autoFocus
            autoComplete="off"
            className="input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {unlock.isError && (
          <p role="alert" className="error-text">
            {getErrorMessage(unlock.error)}
          </p>
        )}

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={unlock.isPending || unlock.isSuccess}
        >
          {unlock.isPending || unlock.isSuccess ? "Opening..." : "Unlock link"}
        </button>
      </form>
    </div>
  );
};

export default ProtectedLinkPage;
