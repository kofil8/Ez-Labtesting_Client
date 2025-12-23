import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { forwardRef } from "react";

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
}

/**
 * Button component with built-in loading state
 * Automatically disables and shows spinner when loading
 */
export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ loading = false, loadingText, children, disabled, ...props }, ref) => {
    return (
      <Button ref={ref} disabled={loading || disabled} {...props}>
        {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
        {loading ? loadingText || children : children}
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";
