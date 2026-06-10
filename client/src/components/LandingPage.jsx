export default function LandingPage({ onStartVideo }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo/Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">OME</h1>
          <p className="text-blue-200 text-lg">Anonymous Video Chat</p>
        </div>

        {/* Main Content */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 mb-8">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-blue-500 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-3">
              Connect Anonymously
            </h2>
            <p className="text-blue-100">
              Meet and chat with random people from around the world. Simple,
              fast, and completely anonymous.
            </p>
          </div>

          <button
            onClick={onStartVideo}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 flex items-center justify-center gap-2 mb-4"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
            </svg>
            Start Video Chat
          </button>
        </div>

        {/* Safety Notice */}
        <div className="bg-yellow-500 bg-opacity-20 border border-yellow-400 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-200">
            <strong>Safety First:</strong> Please be respectful. Users who engage
            in inappropriate behavior will be reported and blocked.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white bg-opacity-5 rounded-lg p-4">
            <div className="text-2xl mb-2">🎯</div>
            <p className="text-sm text-blue-100">Random Matching</p>
          </div>
          <div className="bg-white bg-opacity-5 rounded-lg p-4">
            <div className="text-2xl mb-2">🔒</div>
            <p className="text-sm text-blue-100">Anonymous</p>
          </div>
          <div className="bg-white bg-opacity-5 rounded-lg p-4">
            <div className="text-2xl mb-2">💬</div>
            <p className="text-sm text-blue-100">Text Chat</p>
          </div>
          <div className="bg-white bg-opacity-5 rounded-lg p-4">
            <div className="text-2xl mb-2">⚡</div>
            <p className="text-sm text-blue-100">Instant Connect</p>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-blue-300 text-center">
          By using this service, you agree to our terms of service and privacy
          policy. Must be 18 or older.
        </p>
      </div>
    </div>
  );
}
