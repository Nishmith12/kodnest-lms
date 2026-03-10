"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { Spinner } from '@/components/common/Spinner';

export default function SubjectRootPage() {
    const params = useParams();
    const router = useRouter();
    const subjectId = params.subjectId as string;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFirstVideo = async () => {
            try {
                const { data } = await apiClient.get(`/videos/subject/${subjectId}/first-video`);
                if (data && data.video_id) {
                    router.replace(`/subjects/${subjectId}/video/${data.video_id}`);
                } else {
                    router.replace('/');
                }
            } catch (error) {
                console.error("Failed to find first video", error);
                router.replace('/');
            }
        };

        fetchFirstVideo();
    }, [subjectId, router]);

    if (isLoading) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground p-8">
                <Spinner className="mb-4" />
                <p>Loading course content...</p>
            </div>
        );
    }

    return null;
}
