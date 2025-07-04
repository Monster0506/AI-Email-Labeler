"use client";

import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-6 text-center">Privacy Policy</h1>
        <p className="text-gray-700 mb-8 text-center">
          Your privacy is important to us. This Privacy Policy explains how AI Email collects, uses, and protects your information.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-2">1. Data Collection</h2>
          <p className="text-gray-700">
            We collect only the minimum data necessary to provide our email assistant services. This includes:
          </p>
          <ul className="list-disc ml-8 mt-2 text-gray-700">
            <li>Email metadata (sender, subject, date, labels)</li>
            <li>Email content (for processing and smart replies, only with your consent)</li>
            <li>OAuth tokens for secure access to your Gmail account</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-2">2. Data Usage</h2>
          <p className="text-gray-700">
            Your data is used solely to:
          </p>
          <ul className="list-disc ml-8 mt-2 text-gray-700">
            <li>Organize, label, and prioritize your emails</li>
            <li>Generate AI-powered summaries and smart replies</li>
            <li>Improve your productivity and email experience</li>
          </ul>
          <p className="text-gray-700 mt-2">
            We do <span className="font-semibold text-blue-700">not</span> sell, rent, or share your data with advertisers or third parties for marketing purposes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-2">3. Third-Party Services</h2>
          <p className="text-gray-700">
            We use trusted third-party services (such as Google OAuth and Gemini AI) to provide our features. These services are governed by their own privacy policies. We only share data with them as required to deliver our core functionality.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-2">4. Data Security</h2>
          <p className="text-gray-700">
            We implement industry-standard security measures to protect your data, including encryption in transit and at rest. Access to your data is strictly limited to authorized processes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-2">5. User Rights</h2>
          <p className="text-gray-700">
            You have the right to:
          </p>
          <ul className="list-disc ml-8 mt-2 text-gray-700">
            <li>Access and review your data</li>
            <li>Request deletion of your data</li>
            <li>Revoke access at any time via your Google account settings</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-2">6. Changes to This Policy</h2>
          <p className="text-gray-700">
            We may update this Privacy Policy from time to time. We will notify you of any significant changes by updating the date at the top of this page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-2">7. Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions or concerns about your privacy, please contact us at <a href="mailto:contact@monster0506.dev" className="text-blue-600 underline">contact@monster0506.dev</a>.
          </p>
        </section>

        <div className="mt-8 text-center">
          <Link href="/">
            <span className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors cursor-pointer">Back to Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
} 