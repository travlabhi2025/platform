export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section Skeleton */}
      <section className="relative h-[60vh] md:h-[70vh] bg-slate-200 animate-pulse">
        <div className="absolute inset-0 bg-slate-300" />
        <div className="relative z-10 h-full flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <div className="max-w-3xl">
              <div className="h-16 bg-slate-400 rounded mb-4 w-3/4" />
              <div className="flex flex-wrap items-center gap-4">
                <div className="h-6 bg-slate-400 rounded w-32" />
                <div className="h-6 bg-slate-400 rounded w-24" />
                <div className="h-6 bg-slate-400 rounded w-20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* About Section */}
            <section>
              <div className="h-8 bg-slate-300 rounded mb-6 w-48 animate-pulse" />
              <div className="space-y-4">
                <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
              </div>
            </section>

            {/* Trip Details */}
            <section>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-slate-100 rounded-lg p-4 animate-pulse"
                  >
                    <div className="h-5 bg-slate-300 rounded mb-2 w-20" />
                    <div className="h-4 bg-slate-200 rounded w-16" />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <div className="text-center mb-6 animate-pulse">
                  <div className="h-10 bg-slate-300 rounded mb-2 w-32 mx-auto" />
                  <div className="h-4 bg-slate-200 rounded w-20 mx-auto" />
                </div>

                <div className="space-y-4 mb-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between">
                      <div className="h-4 bg-slate-200 rounded w-16 animate-pulse" />
                      <div className="h-4 bg-slate-200 rounded w-20 animate-pulse" />
                    </div>
                  ))}
                </div>

                <div className="h-12 bg-slate-300 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
