"use client";

import { useRouter } from 'next/navigation';
import { Button } from '../common/Button';
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useVideoStore } from '@/store/videoStore';

interface VideoMetaProps {
    title: string;
    description: string;
    subjectId: number;
}

export function VideoMeta({ title, description, subjectId }: VideoMetaProps) {
    const router = useRouter();
    const { isCompleted, prevVideoId, nextVideoId } = useVideoStore();

    return (
        <div className="mt-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                    {isCompleted && (
                        <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-500">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Completed
                        </span>
                    )}
                </div>
                <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                    {description || "No description provided."}
                </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                <Button
                    variant="outline"
                    disabled={!prevVideoId}
                    onClick={() => prevVideoId && router.push(`/subjects/${subjectId}/video/${prevVideoId}`)}
                >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                </Button>
                <Button
                    disabled={!nextVideoId}
                    onClick={() => nextVideoId && router.push(`/subjects/${subjectId}/video/${nextVideoId}`)}
                >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    );
}
