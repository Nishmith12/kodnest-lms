"use client";

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/lib/auth';
import { Button } from '../common/Button';

export function Header() {
    const { user, isAuthenticated } = useAuthStore();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between px-4 sm:px-8">
                <Link href="/" className="flex items-center space-x-2">
                    <div className="font-bold sm:inline-block text-xl tracking-tight">
                        Kodnest
                    </div>
                </Link>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    {isAuthenticated ? (
                        <nav className="flex items-center space-x-4">
                            <Link href="/profile" className="text-sm font-medium transition-colors hover:text-primary">
                                {user?.name || 'Profile'}
                            </Link>
                            <Button variant="ghost" className="h-8 shadow-none" onClick={() => authApi.logout()}>
                                Log out
                            </Button>
                        </nav>
                    ) : (
                        <nav className="flex items-center space-x-2">
                            <Link href="/auth/login">
                                <Button variant="ghost" className="h-8 relative shadow-none">Sign In</Button>
                            </Link>
                            <Link href="/auth/register">
                                <Button className="h-8">Get Started</Button>
                            </Link>
                        </nav>
                    )}
                </div>
            </div>
        </header>
    );
}
