"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/apiClient';
import { Spinner } from '@/components/common/Spinner';
import { Alert } from '@/components/common/Alert';
import { BookOpen } from 'lucide-react';

interface Subject {
  id: number;
  title: string;
  slug: string;
  description: string;
}

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data } = await apiClient.get<Subject[]>('/subjects');
        setSubjects(data);
      } catch (err: any) {
        setError('Failed to load courses. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          Explore Courses
        </h1>
        <p className="text-xl text-muted-foreground w-full md:w-2/3">
          Master new skills with our structured, step-by-step learning paths designed for modern software engineering.
        </p>
      </div>

      {isLoading ? (
        <div className="h-64 flex justify-center items-center">
          <Spinner />
        </div>
      ) : error ? (
        <Alert message={error} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Link href={`/subjects/${subject.id}`} key={subject.id}>
              <div className="group relative rounded-xl border bg-card text-card-foreground shadow hover:shadow-md transition-all duration-200 overflow-hidden h-full flex flex-col cursor-pointer">
                <div className="p-6 flex flex-col flex-1">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 shrink-0 group-hover:bg-primary/20 transition-colors">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold leading-none tracking-tight mb-3">
                    {subject.title}
                  </h3>
                  <p className="text-muted-foreground text-sm flex-1 leading-relaxed">
                    {subject.description}
                  </p>
                </div>
                <div className="px-6 py-4 bg-muted/30 border-t flex items-center text-sm font-medium text-primary">
                  Start learning
                  <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
