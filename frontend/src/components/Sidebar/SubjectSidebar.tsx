"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useSidebarStore } from '@/store/sidebarStore';
import { Spinner } from '../common/Spinner';
import { CheckCircle2, Lock, PlayCircle } from 'lucide-react';

export function SubjectSidebar() {
    const params = useParams();
    const pathname = usePathname();
    const subjectId = parseInt(params.subjectId as string, 10);

    const { tree, isLoading, error, fetchTree } = useSidebarStore();

    useEffect(() => {
        if (subjectId && (!tree || tree.id !== subjectId)) {
            fetchTree(subjectId);
        }
    }, [subjectId, fetchTree, tree]);

    if (isLoading) {
        return <div className="p-4 flex justify-center"><Spinner /></div>;
    }

    if (error || !tree) {
        return <div className="p-4 text-sm text-destructive">{error || 'Failed to load sidebar'}</div>;
    }

    return (
        <div className="w-full h-full flex flex-col bg-muted/20 border-r">
            <div className="p-4 border-b bg-muted/40 sticky top-0 z-10">
                <h2 className="font-semibold text-base line-clamp-2">{tree.title}</h2>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">
                {tree.sections.map((section) => (
                    <div key={section.id} className="space-y-2">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                            {section.title}
                        </h3>
                        <div className="space-y-1">
                            {section.videos.map((video) => {
                                const isActive = pathname.includes(`/video/${video.id}`);

                                return (
                                    <Link
                                        key={video.id}
                                        href={video.locked ? '#' : `/subjects/${subjectId}/video/${video.id}`}
                                        onClick={(e) => video.locked && e.preventDefault()}
                                        className={`
                      flex items-start gap-3 p-2 rounded-md text-sm transition-colors
                      ${video.locked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent cursor-pointer'}
                      ${isActive ? 'bg-primary/10 text-primary font-medium hover:bg-primary/15' : 'text-foreground'}
                    `}
                                    >
                                        <div className="mt-0.5 shrink-0">
                                            {video.locked ? (
                                                <Lock className="w-4 h-4 text-muted-foreground" />
                                            ) : video.is_completed ? (
                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <PlayCircle className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                                            )}
                                        </div>
                                        <span className="line-clamp-2 flex-1">{video.title}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
