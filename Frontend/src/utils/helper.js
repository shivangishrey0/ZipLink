// The backend answers errors as { error: "message" }.
export const getErrorMessage = (error) => {
  return error?.response?.data?.error ?? "Something went wrong. Please try again.";
};

export const formatDate = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// <input type="datetime-local"> works with local time without a zone ("2026-10-17T18:30").
export const toDateTimeLocal = (value) => {
  if (!value) return "";

  const date = new Date(value);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

export const fromDateTimeLocal = (value) => new Date(value).toISOString();
