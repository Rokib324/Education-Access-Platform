"use client";

import React from 'react'
import { motion } from 'framer-motion'
import { BiAward, BiBullseye, BiHeart, BiWorld } from 'react-icons/bi'

const MISSION_ITEMS = [
  {
    icon: <BiBullseye className="h-5 w-5" />,
    title: "Our Mission",
    text: "To bridge the educational divide by providing high-quality learning resources to underprivileged and remote communities."
  },
  {
    icon: <BiWorld className="h-5 w-5" />,
    title: "Our Vision",
    text: "A world where geographical location and economic status never limit a person's potential to learn and grow."
  },
  {
    icon: <BiHeart className="h-5 w-5" />,
    title: "Our Values",
    text: "Empathy, accessibility, and community-driven impact are at the heart of everything we build."
  }
];

const AboutHero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.2 
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        duration: 0.5 
      } 
    }
  };

  return (
    <section id="about" className="relative overflow-hidden bg-zinc-950 py-24 lg:py-32">
      {/* Background glow blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[100px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left - Narrative */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <span className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
              About EduAccess
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
              Empowering through{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                accessible knowledge
              </span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-zinc-400">
              EduAccess was born out of a simple yet powerful idea: quality education should be a universal right, not a privilege. We build tools specifically designed for the challenges faced by learners in low-bandwidth and remote areas.
            </p>
            <p className="mt-4 text-base leading-relaxed text-zinc-400">
              By offering offline-ready lessons, virtual classrooms, and a supportive community, we're not just providing a platform—we're opening doors to a future filled with opportunity for everyone, everywhere.
            </p>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-10 flex items-center gap-4 border-t border-white/8 pt-8"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-zinc-950 bg-zinc-800 ring-2 ring-indigo-500/20 transition-transform hover:scale-110 hover:z-10 cursor-pointer" />
                ))}
              </div>
              <p className="text-sm font-medium text-zinc-300">
                Join our growing team of passionate educators and creators.
              </p>
            </motion.div>
          </motion.div>

          {/* Right - Mission Cards */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-4 sm:grid-cols-1"
          >
            {MISSION_ITEMS.map((item, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                whileHover={{ x: 10 }}
                className="group relative overflow-hidden rounded-2xl border border-white/8 bg-zinc-900/40 p-6 backdrop-blur-md transition-all hover:border-white/15 hover:bg-zinc-900/60"
              >
                <div className="flex gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-110">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-white transition-colors group-hover:text-indigo-300">
                      {item.title}
                    </h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">
                      {item.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Decorative Achievement Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-2 flex items-center justify-between rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 p-6 transition-all hover:bg-opacity-20"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-indigo-500/20 text-indigo-400">
                  <BiAward className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-300">Innovation in EdTech</p>
                  <p className="text-sm font-medium text-zinc-400">Empowering 50+ remote schools</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AboutHero