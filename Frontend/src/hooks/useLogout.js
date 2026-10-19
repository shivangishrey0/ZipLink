import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { logoutUser } from "../api/User.api.jsx";
import { clearUser } from "../store/slice/authSlice.js";

// One logout flow for the top bar and the dashboard: call the API, then forget the person locally.
export const useLogout = (onDone) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: async () => {
      // Go home first. Forgetting the person while a dashboard page is still on screen would make its
      // login guard send them to the login page instead.
      await navigate({ to: "/" });
      onDone?.();
      dispatch(clearUser());
      // Cached links and analytics belong to the person who just left.
      queryClient.clear();
    },
  });
};
