import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import UrlForm from "../UrlForm.jsx";

// The same shorten form as the home page, in a dialog. A new link refreshes the table behind it.
const CreateLinkModal = ({ open, onClose }) => {
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
      onClose={onClose}
      onClick={(event) => event.target === ref.current && onClose()}
      aria-labelledby="create-link-title"
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-bg-2 p-0 text-ink shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className="p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="create-link-title" className="font-display text-2xl font-extrabold tracking-tight">
              Create a short link
            </h2>
            <p className="mt-1 text-sm text-muted">
              Paste a long address. The new link is saved to your dashboard.
            </p>
          </div>
          <button
            type="button"
            className="btn-ghost h-9 w-9 shrink-0 px-0"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={17} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6">{open && <UrlForm />}</div>
      </div>
    </dialog>
  );
};

export default CreateLinkModal;
