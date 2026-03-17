"use client";

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { BiMailSend, BiMap, BiPhone, BiSend, BiCheckCircle, BiLoaderAlt } from 'react-icons/bi'
import { FaFacebook, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa';

const contactSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

const CONTACT_INFO = [
  {
    icon: <BiMailSend className="h-5 w-5" />,
    label: "Email Us",
    value: "support@eduaccess.org",
    desc: "Our friendly team is here to help."
  },
  {
    icon: <BiMap className="h-5 w-5" />,
    label: "Visit Us",
    value: "Dhaka, Bangladesh",
    desc: "Come say hello at our office."
  },
  {
    icon: <BiPhone className="h-5 w-5" />,
    label: "Call Us",
    value: "+880 1234 567890",
    desc: "Mon-Fri from 9am to 6pm."
  }
];

const SOCIAL_LINKS = [
  {
    icon: <FaFacebook className="h-4 w-4" />,
    url: "#",
  },
  {
    icon: <FaTwitter className="h-4 w-4" />,
    url: "#",
  },
  {
    icon: <FaInstagram className="h-4 w-4" />,
    url: "#",
  },
  {
    icon: <FaLinkedinIn className="h-4 w-4" />,
    url: "#",
  },
];

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('[Contact Form Submission]:', data)
    setIsSubmitting(false)
    setIsSuccess(true)
    reset()
    setTimeout(() => setIsSuccess(false), 5000)
  }

  return (
    <section id="contact" className="relative overflow-hidden bg-zinc-950 py-24 lg:py-32 px-4 sm:px-6">
      {/* Background glow */}
      <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-indigo-600/5 blur-[100px]" />
      
      <div className="relative mx-auto max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
            Get In Touch
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Let's build the future of{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              learning together
            </span>
          </h2>
          <p className="mt-4 text-base text-zinc-400">
            Have questions about our platform or want to support our mission? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-10 lg:grid-cols-3">
          {/* Contact Details */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6 lg:col-span-1"
          >
            {CONTACT_INFO.map((info, idx) => (
              <div key={idx} className="flex gap-4 rounded-2xl border border-white/5 bg-white/2 p-5 backdrop-blur-sm transition-all hover:bg-white/5 group">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-600/20 text-indigo-400 border border-indigo-500/20 transition-transform group-hover:scale-110">
                  {info.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{info.label}</h4>
                  <p className="mt-0.5 text-sm font-medium text-indigo-300">{info.value}</p>
                  <p className="mt-1 text-xs text-zinc-500">{info.desc}</p>
                </div>
              </div>
            ))}
            
            {/* Social Proof/Banner */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white shadow-xl shadow-indigo-500/10 transition-all cursor-pointer"
            >
              <h4 className="font-bold">Follow Our Journey</h4>
              <p className="mt-2 text-xs text-indigo-100/80 leading-relaxed">
                Stay updated with our latest impact stories and platform updates across social media.
              </p>
              <div className="mt-4 flex gap-2">
                {SOCIAL_LINKS.map((link, idx) => (
                  <a 
                    key={idx} 
                    href={link.url} 
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-colors text-indigo-100/70 hover:text-white"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
              <AnimatePresence>
                {isSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-900/90 backdrop-blur-sm text-center p-6"
                  >
                    <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                      <BiCheckCircle className="h-10 w-10 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Message Sent!</h3>
                    <p className="mt-2 text-zinc-400">Thanks for reaching out. We'll get back to you soon.</p>
                    <button 
                      onClick={() => setIsSuccess(false)}
                      className="mt-6 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Send another message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Full Name</label>
                  <input 
                    {...register('fullName')}
                    type="text" 
                    placeholder="John Doe"
                    className={`w-full rounded-xl border ${errors.fullName ? 'border-red-500/50' : 'border-white/10'} bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all`}
                  />
                  {errors.fullName && <p className="text-[10px] text-red-400">{errors.fullName.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Email Address</label>
                  <input 
                    {...register('email')}
                    type="email" 
                    placeholder="john@example.com"
                    className={`w-full rounded-xl border ${errors.email ? 'border-red-500/50' : 'border-white/10'} bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all`}
                  />
                  {errors.email && <p className="text-[10px] text-red-400">{errors.email.message}</p>}
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Subject</label>
                  <input 
                    {...register('subject')}
                    type="text" 
                    placeholder="How can we help?"
                    className={`w-full rounded-xl border ${errors.subject ? 'border-red-500/50' : 'border-white/10'} bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all`}
                  />
                  {errors.subject && <p className="text-[10px] text-red-400">{errors.subject.message}</p>}
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Message</label>
                  <textarea 
                    {...register('message')}
                    rows={4}
                    placeholder="Tell us more about your inquiry..."
                    className={`w-full rounded-xl border ${errors.message ? 'border-red-500/50' : 'border-white/10'} bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none`}
                  />
                  {errors.message && <p className="text-[10px] text-red-400">{errors.message.message}</p>}
                </div>
                <div className="sm:col-span-2 pt-2">
                  <button 
                    disabled={isSubmitting}
                    type="submit" 
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-500/20 transition-all hover:shadow-indigo-500/40 hover:opacity-95 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <BiLoaderAlt className="h-5 w-5 animate-spin" />
                    ) : (
                      <BiSend className="h-4 w-4" />
                    )}
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ContactForm