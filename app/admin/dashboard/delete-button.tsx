"use client";

type Props = {
  label?: string;
  message?: string;
};

export function DeleteButton({ label = "Supprimer", message = "Confirmer la suppression ?" }: Props) {
  return (
    <button
      className="button-secondary"
      type="submit"
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
    >
      {label}
    </button>
  );
}
