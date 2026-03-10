import apiClient from './apiClient';

let progressTimeout: NodeJS.Timeout | null = null;
const DEBOUNCE_MS = 5000;

export async function submitProgressImmediately(
    videoId: number,
    lastPositionSeconds: number,
    isCompleted: boolean = false
) {
    if (progressTimeout) {
        clearTimeout(progressTimeout);
        progressTimeout = null;
    }

    try {
        await apiClient.post(`/progress/videos/${videoId}`, {
            last_position_seconds: Math.floor(lastPositionSeconds),
            is_completed: isCompleted
        });
    } catch (error) {
        console.error('Failed to submit progress:', error);
    }
}

export function debouncedSubmitProgress(videoId: number, lastPositionSeconds: number) {
    if (progressTimeout) {
        clearTimeout(progressTimeout);
    }

    progressTimeout = setTimeout(() => {
        submitProgressImmediately(videoId, lastPositionSeconds, false);
    }, DEBOUNCE_MS);
}
