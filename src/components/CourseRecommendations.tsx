"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiBookOpen, BiChevronRight, BiLoaderAlt } from 'react-icons/bi';
import { HiSparkles } from 'react-icons/hi';
import Link from 'next/link';

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  subject_id: {
    _id: string;
    subject_name: string;
  };
}

const CourseRecommendations = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch('/api/recommendations');
        const data = await res.json();
        setCourses(data.interestBased || []);
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-white/5 bg-white/2 backdrop-blur-sm">
        <BiLoaderAlt className="h-6 w-6 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (courses.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
            <HiSparkles className="h-4 w-4" />
          </div>
          <h2 className="text-xl font-bold text-white">Recommended for You</h2>
        </div>
        <Link 
          href="/dashboard/courses" 
          className="flex items-center gap-1 text-sm font-medium text-zinc-500 transition-colors hover:text-indigo-400"
        >
          View all courses
          <BiChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {courses.map((course, idx) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-zinc-900/50 p-4 transition-all hover:border-indigo-500/30 hover:bg-zinc-900/80 hover:shadow-2xl hover:shadow-indigo-500/10"
            >
              <div className="aspect-video w-full overflow-hidden rounded-xl bg-zinc-800">
                {course.thumbnail ? (
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                    <BiBookOpen className="h-8 w-8 text-indigo-400" />
                  </div>
                )}
              </div>

              <div className="mt-4">
                <span className="inline-block rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  {course.subject_id?.subject_name || 'General'}
                </span>
                <h3 className="mt-2 line-clamp-1 font-bold text-white transition-colors group-hover:text-indigo-300">
                  {course.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-500">
                  {course.description}
                </p>
                
                <Link 
                  href={`/dashboard/courses/${course._id}`}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 py-2.5 text-xs font-bold text-zinc-200 transition-all hover:bg-indigo-500 hover:text-white"
                >
                  Start Learning
                  <BiChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CourseRecommendations;
