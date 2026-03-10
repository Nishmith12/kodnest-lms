import { AuthGuard } from '@/components/Auth/AuthGuard';
import { SubjectSidebar } from '@/components/Sidebar/SubjectSidebar';

export default function SubjectLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="flex flex-1 h-[calc(100vh-3.5rem)] overflow-hidden">
                {/* Desktop Sidebar */}
                <div className="hidden md:block w-80 shrink-0 h-full border-r bg-card">
                    <SubjectSidebar />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background">
                    {children}
                </div>
            </div>
        </AuthGuard>
    );
}
