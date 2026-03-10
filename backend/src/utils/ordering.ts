/**
 * Ordering utility: builds a global video order from sections→videos,
 * determines prev/next, and checks lock status.
 */

export interface OrderedVideo {
    id: number;
    section_id: number;
    order_index: number;
    section_order_index: number;
}

/**
 * Flattens sections and their videos into a globally ordered list.
 * Sections are ordered by order_index, videos within each section by order_index.
 */
export function getGlobalVideoOrder(
    sections: { id: number; order_index: number }[],
    videos: { id: number; section_id: number; order_index: number }[]
): OrderedVideo[] {
    const sortedSections = [...sections].sort((a, b) => a.order_index - b.order_index);

    const result: OrderedVideo[] = [];

    for (const section of sortedSections) {
        const sectionVideos = videos
            .filter(v => v.section_id === section.id)
            .sort((a, b) => a.order_index - b.order_index);

        for (const video of sectionVideos) {
            result.push({
                id: video.id,
                section_id: video.section_id,
                order_index: video.order_index,
                section_order_index: section.order_index,
            });
        }
    }

    return result;
}

/**
 * Given a video ID and the global order, returns the previous and next video IDs.
 */
export function getPrevNextVideos(
    videoId: number,
    globalOrder: OrderedVideo[]
): { previousVideoId: number | null; nextVideoId: number | null } {
    const index = globalOrder.findIndex(v => v.id === videoId);

    if (index === -1) {
        return { previousVideoId: null, nextVideoId: null };
    }

    return {
        previousVideoId: index > 0 ? globalOrder[index - 1].id : null,
        nextVideoId: index < globalOrder.length - 1 ? globalOrder[index + 1].id : null,
    };
}

/**
 * Determines if a video is locked based on the completion status of its prerequisite.
 * Returns { locked, prerequisiteVideoId }.
 */
export function isVideoLocked(
    videoId: number,
    globalOrder: OrderedVideo[],
    completedVideoIds: Set<number>
): { locked: boolean; prerequisiteVideoId: number | null } {
    const index = globalOrder.findIndex(v => v.id === videoId);

    if (index === -1) {
        return { locked: true, prerequisiteVideoId: null };
    }

    // First video is always unlocked
    if (index === 0) {
        return { locked: false, prerequisiteVideoId: null };
    }

    const prerequisiteVideoId = globalOrder[index - 1].id;
    const locked = !completedVideoIds.has(prerequisiteVideoId);

    return { locked, prerequisiteVideoId };
}
