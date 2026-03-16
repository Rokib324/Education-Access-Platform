import React from 'react'
import { BiMailSend, BiMap, BiPhone, BiSend } from 'react-icons/bi'

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

const ContactForm = () => {
  return (
    <section id="contact" className="relative overflow-hidden bg-zinc-950 py-24 lg:py-32 px-4 sm:px-6">
      {/* Background glow */}
      <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-indigo-600/5 blur-[100px]" />
      
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
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
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-3">
          {/* Contact Details */}
          <div className="space-y-6 lg:col-span-1">
            {CONTACT_INFO.map((info, idx) => (
              <div key={idx} className="flex gap-4 rounded-2xl border border-white/5 bg-white/2 p-5 backdrop-blur-sm">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-600/20 text-indigo-400 border border-indigo-500/20">
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
            <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white shadow-xl shadow-indigo-500/10 transition-transform hover:scale-[1.02]">
              <h4 className="font-bold">Follow Our Journey</h4>
              <p className="mt-2 text-xs text-indigo-100/80 leading-relaxed">
                Stay updated with our latest impact stories and platform updates across social media.
              </p>
              <div className="mt-4 flex gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-8 w-8 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 cursor-pointer transition-colors" />
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-8 backdrop-blur-md shadow-2xl">
              <form className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Subject</label>
                  <input 
                    type="text" 
                    placeholder="How can we help?"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Message</label>
                  <textarea 
                    rows={4}
                    placeholder="Tell us more about your inquiry..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none"
                  />
                </div>
                <div className="sm:col-span-2 pt-2">
                  <button type="button" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-500/20 transition-all hover:shadow-indigo-500/40 hover:opacity-95 active:scale-[0.98]">
                    <BiSend className="h-4 w-4" />
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactForm