import { useState } from "react";

import { Eye, EyeClosed } from "../../../lib/icons";
import Icon from "../../../lib/icons/Icon";
import styles from "./Input.module.css";

function Input({
  as = "input",
  label,
  error,
  className = "",
  id,
  type = "text",
  ...props
}) {
  const Component = as;

  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password" && as === "input";

  return (
    <div className={styles.group}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}

      <div className={isPassword ? styles.inputWrapper : undefined}>
        <Component
          id={id}
          type={isPassword && showPassword ? "text" : type}
          className={[styles.input, error && styles.error, className]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <Icon icon={Eye} size="sm" className={styles.passwordIcon}/>
            ) : (
              <Icon icon={EyeClosed} size="sm" className={styles.passwordIcon}/>
            )}
          </button>
        )}
      </div>

      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}

export default Input;
