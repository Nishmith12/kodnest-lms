"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Spinner } from '../common/Spinner';

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated } = useAuthStore();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Small delay to allow hydration of Zustand store from localStorage
        const timeoutId = setTimeout(() => {
            if (!isAuthenticated && !pathname.startsWith('/auth/')) {
                router.push('/auth/login');
            } else if (isAuthenticated && (pathname === '/auth/login' || pathname === '/auth/register')) {
                router.push('/');
            } else {
                setIsChecking(false);
            }
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [isAuthenticated, router, pathname]);

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Spinner />
            </div>
        );
    }

    return <>{children}</>;
}
