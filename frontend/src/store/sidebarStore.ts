import { create } from 'zustand';
import apiClient from '../lib/apiClient';

export interface VideoItem {
    id: number;
    title: string;
    order_index: number;
    is_completed: boolean;
    locked: boolean;
}

export interface Section {
    id: number;
    title: string;
    order_index: number;
    videos: VideoItem[];
}

export interface SubjectTree {
    id: number;
    title: string;
    sections: Section[];
}

interface SidebarState {
    tree: SubjectTree | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchTree: (subjectId: number) => Promise<void>;
    markVideoCompletedLocally: (videoId: number, unlockNextVideoId: number | null) => void;
}

export const useSidebarStore = create<SidebarState>()((set, get) => ({
    tree: null,
    isLoading: false,
    error: null,

    fetchTree: async (subjectId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get<SubjectTree>(`/subjects/${subjectId}/tree`);
            set({ tree: response.data, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.error || 'Failed to fetch course outline',
                isLoading: false
            });
        }
    },

    markVideoCompletedLocally: (videoId, unlockNextVideoId) => {
        const { tree } = get();
        if (!tree) return;

        // Deep clone the tree to mutate
        const newTree = JSON.parse(JSON.stringify(tree)) as SubjectTree;

        let foundCurrent = false;

        for (const section of newTree.sections) {
            for (const video of section.videos) {
                if (video.id === videoId) {
                    video.is_completed = true;
                    foundCurrent = true;
                } else if (video.id === unlockNextVideoId) {
                    video.locked = false;
                }
            }
        }

        if (foundCurrent) {
            set({ tree: newTree });
        }
    }
}));
