import { useState } from 'react';

export default function VideoPlayer({
  localVideoRef,
  remoteVideoRef,
  localStream,
  remoteStream,
  remoteUserId,
  onNextUser,
  onReportUser,
  children,
}) {
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const handleReportSubmit = () => {
    if (reportReason) {
      onReportUser(reportReason, reportDetails);
      setShowReportModal(false);
      setReportReason('');
      setReportDetails('');
    }
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Video Section */}
      <div className="flex-1 flex flex-col relative">
        {/* Remote Video */}
        <div className="flex-1 relative bg-black">
          {remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <p className="text-gray-400">Waiting for remote stream...</p>
              </div>
            </div>
          )}

          {/* Local Video PiP */}
          <div className="absolute bottom-4 right-4 w-40 h-32 bg-black rounded-lg overflow-hidden border-2 border-blue-500 shadow-lg">
            {localStream ? (
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <span className="text-xl">📹</span>
              </div>
            )}
          </div>

          {/* Control Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent p-4 flex justify-center gap-4">
            <button
              onClick={toggleMute}
              className={`p-3 rounded-full transition ${
                isMuted
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M9.383 3.076A1 1 0 010 4v12a1 1 0 001 1h1a1 1 0 001-1V5a1 1 0 00-1-1H1a1 1 0 01-.617-.924zM4 3.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v13a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-13z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16A6 6 0 1020 10v1h-2v-1a4 4 0 00-7.18-1.519L12 13h-2v2H9.381A6.471 6.471 0 018 16z" />
                </svg>
              )}
            </button>

            <button
              onClick={toggleVideo}
              className={`p-3 rounded-full transition ${
                isVideoOff
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
              title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
            >
              {isVideoOff ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
              )}
            </button>

            <button
              onClick={onNextUser}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition"
              title="Next user"
            >
              ⤳ Next
            </button>

            <button
              onClick={() => setShowReportModal(true)}
              className="p-3 rounded-full bg-gray-700 hover:bg-red-600 transition"
              title="Report user"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
        {children}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-white mb-4">Report User</h2>
            <p className="text-gray-300 mb-4">
              Please let us know why you're reporting this user.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Reason
              </label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 outline-none"
              >
                <option value="">Select a reason...</option>
                <option value="inappropriate">Inappropriate behavior</option>
                <option value="harassment">Harassment</option>
                <option value="spam">Spam</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Additional details (optional)
              </label>
              <textarea
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 outline-none resize-none"
                rows="3"
                placeholder="Describe what happened..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportReason('');
                  setReportDetails('');
                }}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReportSubmit}
                disabled={!reportReason}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded transition"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
