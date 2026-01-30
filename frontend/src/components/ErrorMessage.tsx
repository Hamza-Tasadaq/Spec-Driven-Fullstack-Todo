import { AlertCircle, XCircle } from 'lucide-react';
import { Button } from './ui/Button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  variant?: 'inline' | 'page';
}

export function ErrorMessage({ message, onRetry, variant = 'inline' }: ErrorMessageProps) {
  if (variant === 'page') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6 max-w-md">{message}</p>
          {onRetry && (
            <Button onClick={onRetry}>Try Again</Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-red-700">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm text-red-600 hover:text-red-800 font-medium mt-1"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
