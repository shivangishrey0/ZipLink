import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, Zap } from "lucide-react";
import { logoutUser } from "../api/User.api.jsx";
import { clearUser } from "../store/slice/authSlice.js";

const NavBar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logout = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      dispatch(clearUser());
      // Cached links and analytics belong to the user who just left.
      queryClient.clear();
      navigate({ to: "/" });
    },
  });

  return (
    <header className="border-b border-line bg-surface">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-ink">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-brand-ink">
            <Zap size={18} aria-hidden="true" />
          </span>
          ZipLink
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <Link
                to="/urls"
                className="text-sm font-medium text-muted hover:text-ink"
                activeProps={{ className: "text-sm font-medium text-ink" }}
              >
                My links
              </Link>
              <span className="hidden text-sm text-muted sm:inline">{user.name}</span>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
              >
                <LogOut size={16} aria-hidden="true" />
                Log out
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary">
              Log in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
