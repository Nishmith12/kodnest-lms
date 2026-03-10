import { create } from 'zustand';

interface VideoState {
    currentVideoId: number | null;
    subjectId: number | null;
    currentTime: number;
    duration: number | null;
    isPlaying: boolean;
    isCompleted: boolean;

    // Navigation
    nextVideoId: number | null;
    prevVideoId: number | null;

    // Actions
    setVideoState: (videoData: Partial<VideoState>) => void;
    updateTime: (time: number) => void;
    markCompleted: () => void;
    reset: () => void;
}

export const useVideoStore = create<VideoState>()((set) => ({
    currentVideoId: null,
    subjectId: null,
    currentTime: 0,
    duration: null,
    isPlaying: false,
    isCompleted: false,
    nextVideoId: null,
    prevVideoId: null,

    setVideoState: (data) => set((state) => ({ ...state, ...data })),

    updateTime: (currentTime) => set({ currentTime }),

    markCompleted: () => set({ isCompleted: true }),

    reset: () => set({
        currentVideoId: null,
        subjectId: null,
        currentTime: 0,
        duration: null,
        isPlaying: false,
        isCompleted: false,
        nextVideoId: null,
        prevVideoId: null,
    })
}));
