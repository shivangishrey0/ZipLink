import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useDispatch } from "react-redux";
import { LoaderCircle } from "lucide-react";
import { fetchCurrentUser } from "../store/slice/authSlice.js";

// The backend already set the login cookie before sending the browser here.
// This page only asks "who am I now?" and moves on.
const GoogleCallbackPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCurrentUser())
      .unwrap()
      .then((user) => {
        if (user) {
          navigate({ to: "/urls", replace: true });
        } else {
          navigate({ to: "/login", search: { error: "google_failed" }, replace: true });
        }
      });
  }, [dispatch, navigate]);

  return (
    <div className="flex flex-col items-center gap-4 py-28 text-center" role="status">
      <span className="grid h-14 w-14 place-items-center rounded-2xl border border-brand/30 bg-brand/10 text-brand-text">
        <LoaderCircle size={26} className="animate-spin" aria-hidden="true" />
      </span>
      <p className="font-display text-lg font-bold">Finishing sign-in</p>
      <p className="text-sm text-muted">One moment while we log you in.</p>
    </div>
  );
};

export default GoogleCallbackPage;
