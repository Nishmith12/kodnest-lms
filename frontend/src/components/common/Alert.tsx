import { AlertCircle } from 'lucide-react';

export function Alert({ message, type = 'error' }: { message: string, type?: 'error' | 'warning' | 'info' }) {
    const styles = {
        error: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
        warning: 'border-yellow-500/50 text-yellow-600 dark:border-yellow-500 [&>svg]:text-yellow-500',
        info: 'border-blue-500/50 text-blue-600 dark:border-blue-500 [&>svg]:text-blue-500',
    };

    return (
        <div className={`relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11 ${styles[type]}`}>
            <AlertCircle className="h-5 w-5" />
            <div className="text-sm font-medium">
                {message}
            </div>
        </div>
    );
}
