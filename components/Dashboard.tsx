import Image from "next/image";

export default function DashboardCard() {
  return (
    <section className="max-w-5xl mx-auto mt-16 px-6">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">
          Simple Dashboard for Artisans
        </h2>
        <p className="text-gray-600 mt-2">
          Upload your craft, let AI create your story, and watch sales grow globally
        </p>
      </div>

      {/* Dashboard Card */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Top Gradient Bar */}
        <div className="flex justify-between items-center bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-4">
          <div className="flex items-center space-x-3">
            <Image
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full border-2 border-white"
            />
            <div>
              <h3 className="text-white font-semibold">Welcome back, Maya!</h3>
              <p className="text-white/90 text-sm">
                Ceramic Artist from Indonesia
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white text-2xl font-bold">$2,847</p>
            <p className="text-white/90 text-sm">This month&apos;s earnings</p>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-6">
          {/* Quick Upload */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-purple-600">⬆</span> Quick Upload
            </h4>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400 transition-colors">
              <div className="text-gray-400 mb-2">📷</div>
              <p className="text-gray-600">Take a photo of your craft</p>
              <p className="text-purple-600 font-medium mt-1 cursor-pointer">
                Choose Image
              </p>
            </div>
          </div>

          {/* AI Generated Story */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-yellow-500">✏</span> AI Generated Story
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 shadow-sm">
              <p className="italic">
                &quot;This beautiful ceramic bowl carries the wisdom of my
                grandmother&apos;s hands, shaped by centuries of Javanese pottery
                traditions...&quot;
              </p>
              <div className="flex justify-between text-xs mt-2">
                <span className="text-gray-500">Generated in 3 seconds</span>
                <button className="text-purple-600 font-medium hover:underline">
                  Edit Story
                </button>
              </div>
            </div>
          </div>

          {/* Performance */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-pink-500">📈</span> Performance
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Products Listed</span>
                <span className="font-semibold text-gray-900">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Global Views</span>
                <span className="font-semibold text-gray-900">1,847</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sales This Week</span>
                <span className="font-semibold text-green-600">+18</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
