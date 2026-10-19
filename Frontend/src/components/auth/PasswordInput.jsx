import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// A password field with a show/hide button. All other props go to the input.
const PasswordInput = ({ invalid = false, ...props }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={`input pr-12 ${invalid ? "border-danger/60" : ""}`}
        aria-invalid={invalid}
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute top-1/2 right-1.5 grid h-9 w-9 -translate-y-1/2 cursor-pointer place-items-center rounded-md text-muted transition hover:bg-white/5 hover:text-ink"
      >
        {visible ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
      </button>
    </div>
  );
};

export default PasswordInput;
