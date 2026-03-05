import { useNavigate } from "react-router-dom";
import { AlertTriangle, Home, RefreshCw, Bug } from "lucide-react";

const ErrorPage = ({ error, resetError }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleRetry = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  const handleReportBug = () => {
    // Could open a modal or redirect to bug report form
    console.error("Bug report triggered:", error);
    alert(
      "Thank you for reporting! Please share this error details with support:\n\n" +
        error?.message
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-center border border-red-100">
        {/* Error Icon */}
        <div className="mb-6 flex justify-center">
          <div className="bg-red-100 p-4 rounded-full animate-pulse">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Oops! Something went wrong
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          We encountered an unexpected error. Don't worry, your data is safe!
        </p>

        {/* Error Details (Collapsible) */}
        {error && (
          <details className="mb-6 text-left bg-gray-50 rounded-lg p-4 max-h-48 overflow-auto">
            <summary className="font-semibold text-gray-700 cursor-pointer hover:text-gray-900 text-sm">
              Error Details (for debugging)
            </summary>
            <pre className="mt-2 text-xs text-red-600 whitespace-pre-wrap break-words">
              {error.toString()}
              {error.stack && (
                <div className="mt-2 text-gray-500">{error.stack}</div>
              )}
            </pre>
          </details>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleRetry}
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <RefreshCw className="w-5 h-5" />
            Retry
          </button>

          <button
            onClick={handleGoHome}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl border-2 border-gray-200 transition-all duration-200"
          >
            <Home className="w-5 h-5" />
            Go to Home
          </button>

          <button
            onClick={handleReportBug}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
          >
            <Bug className="w-5 h-5" />
            Report Bug
          </button>
        </div>

        {/* Footer Note */}
        <p className="mt-6 text-xs text-gray-400">
          If this problem persists, please contact support with the error
          details.
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
