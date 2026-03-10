"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/apiClient';
import { useAuthStore } from '@/store/authStore';
import { Spinner } from '@/components/common/Spinner';
import { AuthGuard } from '@/components/Auth/AuthGuard';
import { BookOpen, CheckCircle2 } from 'lucide-react';

interface SubjectInfo {
    id: number;
    title: string;
}

interface ProgressStats {
    total_videos: number;
    completed_videos: number;
    percent_complete: number;
}

interface SubjectWithProgress extends SubjectInfo {
    progress: ProgressStats;
}

export default function ProfilePage() {
    const { user } = useAuthStore();
    const [subjectsWithProgress, setSubjectsWithProgress] = useState<SubjectWithProgress[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // Fetch all subjects
                const { data: subjects } = await apiClient.get<SubjectInfo[]>('/subjects');

                // Fetch progress for each subject
                const progressPromises = subjects.map(subject =>
                    apiClient.get<ProgressStats>(`/progress/subjects/${subject.id}`)
                        .then(res => ({ ...subject, progress: res.data }))
                        .catch(() => ({ ...subject, progress: { total_videos: 0, completed_videos: 0, percent_complete: 0 } }))
                );

                const results = await Promise.all(progressPromises);

                // Only show subjects the user has started (or we can show all, but started makes more sense for a profile)
                const activeSubjects = results.filter(s => s.progress.total_videos > 0);

                setSubjectsWithProgress(activeSubjects);
            } catch (error) {
                console.error("Failed to fetch profile data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    return (
        <AuthGuard>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="bg-card border rounded-xl shadow-sm p-6 mb-8 flex items-center gap-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-3xl font-bold text-primary">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{user?.name}</h1>
                        <p className="text-muted-foreground">{user?.email}</p>
                    </div>
                </div>

                <h2 className="text-xl font-bold mb-6">Your Learnings</h2>

                {isLoading ? (
                    <div className="py-12 flex justify-center"><Spinner /></div>
                ) : subjectsWithProgress.length === 0 ? (
                    <div className="text-center py-12 border rounded-xl bg-muted/10 border-dashed">
                        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No courses started yet</h3>
                        <p className="text-muted-foreground mb-4">Start learning by exploring our course catalog.</p>
                        <Link href="/" className="text-primary hover:underline font-medium">Browse Courses →</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {subjectsWithProgress.map(subject => (
                            <div key={subject.id} className="bg-card border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-6">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg mb-1">{subject.title}</h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span>{subject.progress.completed_videos} / {subject.progress.total_videos} lessons</span>
                                        <span>•</span>
                                        {subject.progress.percent_complete === 100 ? (
                                            <span className="text-green-600 font-medium flex items-center gap-1">
                                                <CheckCircle2 className="w-4 h-4" /> Completed
                                            </span>
                                        ) : (
                                            <span>{subject.progress.percent_complete}% complete</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 w-full sm:w-1/3">
                                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                                            style={{ width: `${subject.progress.percent_complete}%` }}
                                        />
                                    </div>
                                    <Link
                                        href={`/subjects/${subject.id}`}
                                        className="shrink-0 text-sm font-medium text-primary hover:underline"
                                    >
                                        {subject.progress.percent_complete === 100 ? 'Review' : 'Continue'}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthGuard>
    );
}
