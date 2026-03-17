"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BiTargetLock, BiCheck, BiPlus } from 'react-icons/bi';

const SUGGESTED_INTERESTS = [
  "Medicine", "Engineering", "Technology", "Business", "Arts", 
  "Agriculture", "Teaching", "Law", "Nursing", "Design"
];

const InterestSelection = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Fetch current interests
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/user/profile');
        const data = await res.json();
        if (data?.user?.interests) {
          setSelected(data.user.interests);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };
    fetchProfile();
  }, []);

  const toggleInterest = (interest: string) => {
    setSelected(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest) 
        : [...prev, interest]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests: selected })
      });
      
      if (res.ok) {
        // Refresh to show new recommendations
        window.location.reload(); 
      }
    } catch (err) {
      console.error('Failed to save interests:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-md">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/40 text-white p-1">
          <BiTargetLock className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Define Your Path</h2>
          <p className="text-xs text-white">Select fields you're interested in for better recommendations.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {SUGGESTED_INTERESTS.map(interest => {
          const isSelected = selected.includes(interest);
          return (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
                isSelected 
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-500/10' 
                  : 'border-white/5 bg-white/5 text-zinc-400 hover:border-white/10 hover:bg-white/10'
              }`}
            >
              {isSelected ? <BiCheck className="h-3.5 w-3.5" /> : <BiPlus className="h-3.5 w-3.5" />}
              {interest}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving || selected.length === 0}
          className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
        >
          {isSaving ? 'Updating...' : 'Save Interests'}
        </button>
      </div>
    </div>
  );
};

export default InterestSelection;
