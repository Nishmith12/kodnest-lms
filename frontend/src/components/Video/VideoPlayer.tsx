"use client";

import { useEffect, useRef, useState } from 'react';
import YouTube, { YouTubeProps, YouTubePlayer } from 'react-youtube';
import { useVideoStore } from '@/store/videoStore';
import { debouncedSubmitProgress, submitProgressImmediately } from '@/lib/progress';

interface VideoPlayerProps {
    videoId: number;
    youtubeId: string;
    startPositionSeconds: number;
    onCompleted?: () => void;
}

export function VideoPlayer({
    videoId,
    youtubeId,
    startPositionSeconds,
    onCompleted
}: VideoPlayerProps) {

    const playerRef = useRef<YouTubePlayer | null>(null);
    const [isReady, setIsReady] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const { isCompleted } = useVideoStore();

    // Extract YouTube ID from URL if full URL is provided instead of just ID
    const parseYouTubeId = (urlOrId: string) => {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = urlOrId.match(regExp);
        return (match && match[7].length === 11) ? match[7] : urlOrId;
    };

    const actualYoutubeId = parseYouTubeId(youtubeId);

    useEffect(() => {
        return () => {
            // Cleanup interval on unmount
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            // Send final progress chunk on unmount
            if (playerRef.current && isReady && !isCompleted) {
                submitProgressImmediately(videoId, playerRef.current.getCurrentTime());
            }
        };
    }, [videoId, isReady, isCompleted]);

    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        playerRef.current = event.target;
        useVideoStore.getState().setVideoState({ duration: event.target.getDuration() });

        if (startPositionSeconds > 0) {
            event.target.seekTo(startPositionSeconds, true);
        }

        setIsReady(true);
    };

    const startProgressTracking = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        useVideoStore.getState().setVideoState({ isPlaying: true });

        intervalRef.current = setInterval(() => {
            if (playerRef.current) {
                const time = playerRef.current.getCurrentTime();
                useVideoStore.getState().updateTime(time);
                if (!isCompleted) {
                    debouncedSubmitProgress(videoId, time);
                }
            }
        }, 1000);
    };

    const stopProgressTracking = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        useVideoStore.getState().setVideoState({ isPlaying: false });

        // Ensure we flush the latest time
        if (playerRef.current && !isCompleted) {
            submitProgressImmediately(videoId, playerRef.current.getCurrentTime());
        }
    };

    const onPlayerStateChange: YouTubeProps['onStateChange'] = (event) => {
        // PLAYING = 1
        if (event.data === 1) {
            startProgressTracking();
        }
        // PAUSED = 2, BUFFERING = 3, ENDED = 0
        else {
            stopProgressTracking();

            if (event.data === 0) {
                handleCompletion();
            }
        }
    };

    const handleCompletion = async () => {
        useVideoStore.getState().markCompleted();
        await submitProgressImmediately(videoId, playerRef.current?.getCurrentTime() || 0, true);

        if (onCompleted) {
            onCompleted();
        }
    };

    const opts: YouTubeProps['opts'] = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 0,
            modestbranding: 1,
            rel: 0,
        },
    };

    return (
        <div className="relative w-full overflow-hidden bg-black rounded-xl shadow-lg" style={{ paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
            <div className="absolute inset-0">
                <YouTube
                    videoId={actualYoutubeId}
                    opts={opts}
                    onReady={onPlayerReady}
                    onStateChange={onPlayerStateChange}
                    className="w-full h-full"
                    iframeClassName="w-full h-full"
                />
            </div>
        </div>
    );
}
