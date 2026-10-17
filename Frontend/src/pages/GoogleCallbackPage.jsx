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
    <div className="flex flex-col items-center gap-3 py-24 text-muted" role="status">
      <LoaderCircle className="animate-spin" />
      Finishing sign-in...
    </div>
  );
};

export default GoogleCallbackPage;
