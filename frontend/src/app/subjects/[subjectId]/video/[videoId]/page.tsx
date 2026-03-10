"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { useVideoStore } from '@/store/videoStore';
import { useSidebarStore } from '@/store/sidebarStore';
import { VideoPlayer } from '@/components/Video/VideoPlayer';
import { VideoMeta } from '@/components/Video/VideoMeta';
import { Spinner } from '@/components/common/Spinner';
import { Alert } from '@/components/common/Alert';
import { Lock } from 'lucide-react';

interface VideoDetail {
    id: number;
    title: string;
    description: string;
    youtube_url: string;
    duration_seconds: number | null;
    subject_id: number;
    subject_title: string;
    section_title: string;
    previous_video_id: number | null;
    next_video_id: number | null;
    locked: boolean;
    unlock_reason: string | null;
}

interface ProgressData {
    last_position_seconds: number;
    is_completed: boolean;
}

export default function VideoPage() {
    const params = useParams();
    const router = useRouter();
    const videoId = parseInt(params.videoId as string, 10);
    const subjectId = parseInt(params.subjectId as string, 10);

    const [video, setVideo] = useState<VideoDetail | null>(null);
    const [startPosition, setStartPosition] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const { reset, setVideoState } = useVideoStore();
    const { markVideoCompletedLocally } = useSidebarStore();

    useEffect(() => {
        let isMounted = true;

        const loadVideoAndProgress = async () => {
            setIsLoading(true);
            setError('');
            reset(); // clear previous video state

            try {
                // 1. Fetch Video Detail (includes lock info and prev/next logic)
                const { data: videoData } = await apiClient.get<VideoDetail>(`/videos/${videoId}`);

                if (!isMounted) return;
                setVideo(videoData);

                // Populate store
                setVideoState({
                    currentVideoId: videoId,
                    subjectId: videoData.subject_id,
                    prevVideoId: videoData.previous_video_id,
                    nextVideoId: videoData.next_video_id,
                });

                // 2. ONLY if unlocked, fetch user's precise progress
                if (!videoData.locked) {
                    const { data: progressData } = await apiClient.get<ProgressData>(`/progress/videos/${videoId}`);

                    if (isMounted) {
                        // Subtract a few seconds to let user re-orient
                        const pos = Math.max(0, progressData.last_position_seconds - 3);
                        setStartPosition(pos);

                        setVideoState({
                            currentTime: pos,
                            isCompleted: progressData.is_completed
                        });
                    }
                }
            } catch (err: any) {
                if (isMounted) {
                    setError(err.response?.data?.error || 'Failed to load video.');
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        if (videoId) {
            loadVideoAndProgress();
        }

        return () => { isMounted = false; };
    }, [videoId, reset, setVideoState]);

    const handleVideoCompleted = () => {
        if (video) {
            // Optimistically update the sidebar
            markVideoCompletedLocally(videoId, video.next_video_id);

            // Auto-navigate to next video if it exists
            if (video.next_video_id) {
                router.push(`/subjects/${subjectId}/video/${video.next_video_id}`);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (error || !video) {
        return <div className="p-8"><Alert message={error || 'Video not found'} /></div>;
    }

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
            <div className="mb-4 text-sm text-muted-foreground">
                <span>{video.subject_title}</span>
                <span className="mx-2">•</span>
                <span>{video.section_title}</span>
            </div>

            {video.locked ? (
                <div className="w-full aspect-video bg-muted/30 rounded-xl border-dashed border-2 flex flex-col items-center justify-center text-center p-6 shadow-sm">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Lock className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Video Locked</h2>
                    <p className="text-muted-foreground max-w-md">
                        {video.unlock_reason || "You must complete the previous video to unlock this content."}
                    </p>
                </div>
            ) : (
                <VideoPlayer
                    videoId={videoId}
                    youtubeId={video.youtube_url}
                    startPositionSeconds={startPosition}
                    onCompleted={handleVideoCompleted}
                />
            )}

            <VideoMeta
                title={video.title}
                description={video.description}
                subjectId={subjectId}
            />
        </div>
    );
}
