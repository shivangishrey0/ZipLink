import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { store } from "./store/store.js";
import { fetchCurrentUser } from "./store/slice/authSlice.js";
import { router } from "./routing/index.jsx";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    // A failed request is usually a real answer (wrong password, 404), retrying would only delay it.
    queries: { retry: false, refetchOnWindowFocus: false },
  },
});

// Start the "who is logged in" check right away. RootLayout waits for its answer.
store.dispatch(fetchCurrentUser());

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
