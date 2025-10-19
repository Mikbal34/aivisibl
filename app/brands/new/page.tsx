import BrandForm from '@/components/brand/BrandForm'
import Navigation from '@/components/layout/Navigation'
import Link from 'next/link'

export default function NewBrandPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-purple-600 mb-8 group transition-colors"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>

          {/* Header */}
          <div className="mb-10">
            <div className="inline-block mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text text-sm font-bold tracking-wider uppercase">
                Step 1 of 4
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Create Your Brand Profile
            </h1>
            <p className="text-lg text-slate-600">
              Let's start by setting up your brand's basic information. This will help us provide more accurate analysis.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
            <div className="p-8 md:p-10">
              <BrandForm />
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mt-10 flex items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-sm font-bold">
                1
              </div>
              <span className="text-sm font-medium text-slate-900">Brand Info</span>
            </div>
            <div className="w-12 h-0.5 bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-sm font-bold">
                2
              </div>
              <span className="text-sm text-slate-400">Prompts</span>
            </div>
            <div className="w-12 h-0.5 bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-sm font-bold">
                3
              </div>
              <span className="text-sm text-slate-400">Competitors</span>
            </div>
            <div className="w-12 h-0.5 bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-sm font-bold">
                4
              </div>
              <span className="text-sm text-slate-400">Analysis</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
