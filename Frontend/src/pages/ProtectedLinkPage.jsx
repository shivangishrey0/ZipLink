import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, LoaderCircle, Lock } from "lucide-react";
import { unlockUrl } from "../api/ShortUrl.api.jsx";
import { getErrorMessage } from "../utils/helper.js";
import PasswordInput from "../components/auth/PasswordInput.jsx";
import StatusCard from "../components/StatusCard.jsx";

// The backend redirects visitors here for password protected links: /protected/<short code>.
const ProtectedLinkPage = () => {
  const { code } = useParams({ strict: false });
  const [password, setPassword] = useState("");

  const unlock = useMutation({
    mutationFn: () => unlockUrl(code, password),
    // The server only answers with the destination after the password matched.
    onSuccess: (url) => window.location.assign(url),
  });

  const busy = unlock.isPending || unlock.isSuccess;

  return (
    <StatusCard
      icon={Lock}
      tone="brand"
      title="This link is protected"
      actions={
        <form
          onSubmit={(event) => {
            event.preventDefault();
            unlock.mutate();
          }}
          className="card w-full space-y-4 text-left"
        >
          <div>
            <label htmlFor="unlock-password" className="label">
              Password
            </label>
            <PasswordInput
              id="unlock-password"
              required
              autoFocus
              autoComplete="off"
              placeholder="Enter the password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {unlock.isError && (
            <p role="alert" className="error-text">
              {getErrorMessage(unlock.error)}
            </p>
          )}

          <button type="submit" className="btn-primary h-11 w-full" disabled={busy}>
            {busy ? (
              <>
                <LoaderCircle size={17} className="animate-spin" aria-hidden="true" />
                Opening
              </>
            ) : (
              <>
                Unlock link
                <ArrowRight size={17} aria-hidden="true" />
              </>
            )}
          </button>
        </form>
      }
    >
      <p>Enter the password the owner gave you to continue.</p>
    </StatusCard>
  );
};

export default ProtectedLinkPage;
