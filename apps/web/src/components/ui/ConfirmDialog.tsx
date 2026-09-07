import { Modal } from "./Modal";
import { Button } from "./Button";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  isDestructive?: boolean;
  isConfirming?: boolean;
}

/**
 * Replaces every raw confirm() call found in the old script.js — flagged in
 * the migration plan for journal deletion and elsewhere. Never used for
 * destructive actions without an explicit, named confirm button (never a
 * bare browser confirm() dialog with generic OK/Cancel).
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  isDestructive = true,
  isConfirming = false,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title} description={description}>
      <div className="mt-2 flex justify-end gap-2">
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isConfirming}>
          {cancelLabel}
        </Button>
        <Button
          variant={isDestructive ? "danger" : "primary"}
          onClick={onConfirm}
          isLoading={isConfirming}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
