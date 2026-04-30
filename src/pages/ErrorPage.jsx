import { useNavigate } from "react-router-dom";
import { Home, RefreshCw, Bug } from "lucide-react";

const ErrorPage = ({ error, resetError }) => {
  const navigate = useNavigate();

  const handleGoHome = () => navigate("/");

  const handleRetry = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  const handleReportBug = () => {
    console.error("Bug report triggered:", error);
    alert(
      "Thank you for reporting! Please share this error details with support:\n\n" +
        error?.message
    );
  };

  return (
    <div className="min-h-screen bg-kawaii flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute -top-32 -left-20 w-[28rem] h-[28rem] bg-sakura-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-24 w-[24rem] h-[24rem] bg-emerald-300/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        <div className="washi-tape -top-3 left-12 transform -rotate-6" />
        <div className="washi-tape -top-3 right-12 transform rotate-3" />

        <div className="sticker bg-white rounded-3xl p-7 text-center space-y-5">
          <div className="text-7xl animate-wiggle inline-block">😿</div>

          <div>
            <h1 className="font-kawaii font-bold text-2xl text-ink mb-1">
              Oops!
            </h1>
            <p className="font-script text-xl text-sakura-600">something broke ♡</p>
          </div>

          <p className="text-ink/70 text-sm">
            Don't worry — your ranking is safe. Try again or head home.
          </p>

          {error && (
            <details className="text-left bg-cream rounded-2xl p-3 max-h-40 overflow-auto border-2 border-ink/10">
              <summary className="font-kawaii font-bold text-ink cursor-pointer text-xs">
                Error details
              </summary>
              <pre className="mt-2 text-xs text-sakura-700 whitespace-pre-wrap break-words">
                {error.toString()}
                {error.stack && (
                  <div className="mt-2 text-ink/50">{error.stack}</div>
                )}
              </pre>
            </details>
          )}

          <div className="space-y-2.5">
            <button
              onClick={handleRetry}
              className="btn-pop bg-gradient-to-r from-emerald-300 to-emerald-500 w-full py-3 rounded-full font-kawaii font-bold text-white flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>

            <button
              onClick={handleGoHome}
              className="btn-pop bg-white w-full py-3 rounded-full font-kawaii font-bold text-ink flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go Home
            </button>

            <button
              onClick={handleReportBug}
              className="btn-pop-pink bg-sakura-100 w-full py-2.5 rounded-full font-kawaii font-bold text-sakura-700 flex items-center justify-center gap-2 text-sm"
            >
              <Bug className="w-4 h-4" />
              Report Bug
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
