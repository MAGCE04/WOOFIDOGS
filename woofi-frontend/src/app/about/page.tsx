'use client';

import Layout from '@/components/Layout';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">About Woofi</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Woofi was founded with a simple but powerful mission: to leverage blockchain technology to create a transparent, 
              efficient platform for supporting rescued dogs in need.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We believe that every dog deserves a loving home, proper care, and the chance to live a happy, healthy life. 
              By connecting dog lovers directly with rescued dogs through the Solana blockchain, we're creating a new model 
              for animal welfare that emphasizes transparency, community involvement, and direct impact.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              When you donate through Woofi, you can see exactly which dog your contribution is helping and track the total 
              support each dog receives. This direct connection creates a more meaningful giving experience and ensures that 
              resources go exactly where they're needed most.
            </p>
          </div>
          <div className="relative h-80 w-full rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1450778869180-41d0601e046e"
              alt="Dogs playing"
              fill
              className="object-cover"
            />
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">How Your Donations Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Food & Nutrition</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Provides high-quality food tailored to each dog's specific nutritional needs.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Medical Care</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Covers veterinary visits, medications, surgeries, and preventative care.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Shelter & Comfort</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Ensures dogs have safe, comfortable living spaces with proper bedding and shelter.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Enrichment & Training</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Provides toys, training, and socialization to improve quality of life and adoption chances.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Why Blockchain?</h2>
          <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We chose to build Woofi on the Solana blockchain for several important reasons:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400">
              <li>
                <span className="font-medium">Transparency:</span> All donations are recorded on the blockchain, creating an immutable record of support.
              </li>
              <li>
                <span className="font-medium">Efficiency:</span> Solana's low transaction fees mean more of your donation goes directly to helping dogs.
              </li>
              <li>
                <span className="font-medium">Speed:</span> Donations are processed almost instantly, allowing for immediate support.
              </li>
              <li>
                <span className="font-medium">Direct Connection:</span> Smart contracts ensure donations go directly to the intended recipient without intermediaries.
              </li>
              <li>
                <span className="font-medium">Global Reach:</span> Anyone with a Solana wallet can contribute, regardless of location.
              </li>
            </ul>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
                  alt="Sarah Johnson"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sarah Johnson</h3>
              <p className="text-gray-600 dark:text-gray-400">Founder & Director</p>
            </div>
            <div className="text-center">
              <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                  alt="David Chen"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">David Chen</h3>
              <p className="text-gray-600 dark:text-gray-400">Blockchain Developer</p>
            </div>
            <div className="text-center">
              <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956"
                  alt="Maria Rodriguez"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Maria Rodriguez</h3>
              <p className="text-gray-600 dark:text-gray-400">Veterinary Coordinator</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}