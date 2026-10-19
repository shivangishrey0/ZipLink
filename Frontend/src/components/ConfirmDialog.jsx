import { useEffect, useRef } from "react";
import { LoaderCircle, TriangleAlert } from "lucide-react";

// An in-app confirmation (a native <dialog>), instead of the browser's plain confirm() popup.
const ConfirmDialog = ({
  open,
  title,
  children,
  confirmLabel = "Confirm",
  pending = false,
  error = "",
  onConfirm,
  onCancel,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onCancel}
      onClick={(event) => event.target === ref.current && !pending && onCancel()}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-white/10 bg-surface p-0 text-ink shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className="p-6">
        <span className="grid h-11 w-11 place-items-center rounded-full border border-danger/30 bg-danger-soft text-danger">
          <TriangleAlert size={20} aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-display text-xl font-bold tracking-tight">{title}</h2>
        <div className="mt-2 text-sm leading-relaxed text-muted">{children}</div>

        {error && (
          <p role="alert" className="error-text mt-4">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={onCancel} disabled={pending}>
            Cancel
          </button>
          <button
            type="button"
            className="btn bg-danger text-bg hover:brightness-110"
            onClick={onConfirm}
            disabled={pending}
          >
            {pending && <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ConfirmDialog;
