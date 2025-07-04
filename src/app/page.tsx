"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center flex-1 py-24 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 drop-shadow-lg"
        >
          Welcome to <span className="underline decoration-wavy decoration-blue-400">AI Email</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto mb-10"
        >
          The next-generation email assistant powered by AI. Organize, label, and reply to your emails with a single click. Let AI handle the clutter so you can focus on what matters.
        </motion.p>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.7, type: "spring" }}
          className="flex flex-col md:flex-row gap-4 justify-center"
        >
          <Link href="/login">
            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg shadow-lg transition-colors">
              Get Started
            </button>
          </Link>
          <a href="#features" className="px-8 py-4 bg-white border border-blue-600 text-blue-600 text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-50 transition-colors">
            Learn More
          </a>
        </motion.div>
        {/* Animated Graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-16 flex justify-center"
        >
          <svg width="320" height="180" viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.rect
              x="10" y="30" width="300" height="120" rx="24"
              fill="#fff" stroke="#a5b4fc" strokeWidth="4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: 1.2 }}
            />
            <motion.rect
              x="30" y="50" width="80" height="20" rx="8"
              fill="#dbeafe"
              animate={{ y: [50, 40, 50] }}
              transition={{ repeat: Infinity, duration: 2, repeatType: "reverse", delay: 2 }}
            />
            <motion.rect
              x="120" y="50" width="170" height="20" rx="8"
              fill="#f3e8ff"
              animate={{ y: [50, 60, 50] }}
              transition={{ repeat: Infinity, duration: 2, repeatType: "reverse", delay: 2.2 }}
            />
            <motion.rect
              x="30" y="80" width="260" height="20" rx="8"
              fill="#e0e7ff"
              animate={{ x: [30, 40, 30] }}
              transition={{ repeat: Infinity, duration: 2.5, repeatType: "reverse", delay: 2.4 }}
            />
            <motion.rect
              x="30" y="110" width="200" height="20" rx="8"
              fill="#fef9c3"
              animate={{ x: [30, 50, 30] }}
              transition={{ repeat: Infinity, duration: 2.8, repeatType: "reverse", delay: 2.6 }}
            />
          </svg>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-8 shadow-lg flex flex-col items-center"
          >
            <svg width="48" height="48" fill="none" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#a5b4fc" /><path d="M16 24l6 6 10-10" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <h3 className="text-xl font-bold mt-4 mb-2 text-blue-900">AI-Powered Organization</h3>
            <p className="text-gray-700">Automatically label, sort, and prioritize your emails using advanced AI models. Never miss an important message again.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl p-8 shadow-lg flex flex-col items-center"
          >
            <svg width="48" height="48" fill="none" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#c4b5fd" /><path d="M16 24l6 6 10-10" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <h3 className="text-xl font-bold mt-4 mb-2 text-purple-900">Smart Replies</h3>
            <p className="text-gray-700">Let AI draft quick, context-aware replies for you. Save time and communicate more efficiently with one click.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-2xl p-8 shadow-lg flex flex-col items-center"
          >
            <svg width="48" height="48" fill="none" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#fde68a" /><path d="M16 24l6 6 10-10" stroke="#f59e42" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <h3 className="text-xl font-bold mt-4 mb-2 text-yellow-900">Privacy First</h3>
            <p className="text-gray-700">Your data stays yours. All processing is secure and privacy-focused, with no unnecessary data retention.</p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section className="py-24 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-100">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900">What Our Users Say</h2>
          <p className="text-lg text-gray-700">AI Email is already helping people save hours every week. Here's what they think:</p>
        </div>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center"
          >
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="w-16 h-16 rounded-full mb-4 shadow" />
            <p className="text-gray-700 italic mb-2">"AI Email has completely changed how I handle my inbox. I'm finally on top of things!"</p>
            <span className="font-semibold text-blue-700">Josh R.</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center"
          >
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="w-16 h-16 rounded-full mb-4 shadow" />
            <p className="text-gray-700 italic mb-2">"The smart replies are a lifesaver. I can get through my emails in half the time."</p>
            <span className="font-semibold text-purple-700">Emily S.</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center"
          >
            <img src="https://randomuser.me/api/portraits/men/65.jpg" alt="User" className="w-16 h-16 rounded-full mb-4 shadow" />
            <p className="text-gray-700 italic mb-2">"I love the privacy focus. I know my data is safe and my workflow is faster."</p>
            <span className="font-semibold text-yellow-700">Alex T.</span>
          </motion.div>
        </div>
      </section> */}

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-6"
        >
          Ready to experience the future of email?
        </motion.h2>
        <Link href="/login">
          <button className="px-10 py-4 bg-white text-blue-700 font-bold text-lg rounded-lg shadow-lg hover:bg-blue-50 transition-colors">
            Get Started for Free
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm bg-white border-t border-gray-200 flex flex-col items-center gap-2">
        &copy; {new Date().getFullYear()} AI Email. All rights reserved.
        <Link href="/privacy-policy" className="text-blue-600 underline hover:text-blue-800 transition-colors">Privacy Policy</Link>
      </footer>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-purple-900">Frequently Asked Questions</h2>
        </div>
        <div className="max-w-3xl mx-auto grid gap-8">
          <div className="bg-white rounded-xl shadow p-6 text-left">
            <h3 className="font-bold text-lg text-blue-700 mb-2">Is my data safe with AI Email?</h3>
            <p className="text-gray-700">Absolutely. We use industry-standard encryption and never sell or share your data. See our <Link href="/privacy-policy" className="text-blue-600 underline">Privacy Policy</Link> for details.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-left">
            <h3 className="font-bold text-lg text-blue-700 mb-2">Can I use AI Email with multiple accounts?</h3>
            <p className="text-gray-700">Yes! You can connect and manage multiple Gmail accounts seamlessly.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-left">
            <h3 className="font-bold text-lg text-blue-700 mb-2">What does the AI actually do?</h3>
            <p className="text-gray-700">AI Email analyzes your inbox, labels and prioritizes messages, and can draft smart replies for you. You always have the final say before anything is sent or changed.</p>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900">Integrations</h2>
          <p className="text-lg text-gray-700">AI Email works seamlessly with your favorite tools.</p>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-1 gap-8">
          <div className="flex flex-col items-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png" alt="Gmail" className="w-16 h-16 mb-2" />
            <span className="font-semibold text-blue-700">Gmail</span>
          </div>
          <h3 className="text-center text-lg text-gray-700">More integrations coming soon!</h3>
          <div className="flex flex-col items-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" alt="Google Calendar" className="w-16 h-16 mb-2" />
            <span className="font-semibold text-blue-700">Google Calendar</span>
          </div>
          <div className="flex flex-col items-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svgg" alt="Google Drive" className="w-16 h-16 mb-2" />
            <span className="font-semibold text-blue-700">Google Drive</span>
          </div>
        </div>
      </section>

      {/* How It Works Timeline */}
      <section className="py-24 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-100">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900">How AI Email Works</h2>
        </div>
        <div className="max-w-3xl mx-auto">
          <ol className="relative border-l-4 border-blue-200">
            <li className="mb-12 ml-6">
              <span className="absolute -left-6 flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full text-white font-bold text-xl">1</span>
              <h3 className="font-bold text-lg text-blue-700 mb-2">Connect Your Gmail</h3>
              <p className="text-gray-700">Sign in securely with Google OAuth. We never see your password.</p>
            </li>
            <li className="mb-12 ml-6">
              <span className="absolute -left-6 flex items-center justify-center w-12 h-12 bg-purple-600 rounded-full text-white font-bold text-xl">2</span>
              <h3 className="font-bold text-lg text-purple-700 mb-2">AI Analyzes Your Inbox</h3>
              <p className="text-gray-700">Our AI scans your emails, labels, and prioritizes them for you.</p>
            </li>
            <li className="mb-12 ml-6">
              <span className="absolute -left-6 flex items-center justify-center w-12 h-12 bg-yellow-400 rounded-full text-white font-bold text-xl">3</span>
              <h3 className="font-bold text-lg text-yellow-700 mb-2">Smart Suggestions</h3>
              <p className="text-gray-700">Get instant suggestions for replies, archiving, and more. You're always in control.</p>
            </li>
            <li className="ml-6">
              <span className="absolute -left-6 flex items-center justify-center w-12 h-12 bg-green-600 rounded-full text-white font-bold text-xl">4</span>
              <h3 className="font-bold text-lg text-green-700 mb-2">Boost Your Productivity</h3>
              <p className="text-gray-700">Save hours every week and keep your inbox under control effortlessly.</p>
            </li>
          </ol>
        </div>
      </section>
    </main>
  );
} 