import { Component } from "react";
import { XCircle, RefreshCw, Home } from "lucide-react";
import i18n from "../i18n";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("🚨 ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });

    // Log to error reporting service (e.g., Sentry) in production
    if (import.meta.env.PROD) {
      // TODO: Add Sentry or similar error tracking
      console.error("Production error:", error.message);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    // Clear any persisted state that might be triggering the error.
    // Keys must match what Results and sortPersistence actually write.
    try {
      localStorage.removeItem("klp48-ranking");
      localStorage.removeItem("klp48.sortSession.v1");
    } catch {
      // localStorage unavailable (private mode) — best effort
    }
    window.location.href = "/";
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      const t = i18n.t.bind(i18n);
      return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-center border border-emerald-100">
            <div className="mb-6 flex justify-center">
              <div className="bg-red-100 p-4 rounded-full">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {t("errorBoundary.title")}
            </h1>

            <p className="text-gray-600 mb-6">
              {t("errorBoundary.body")}
            </p>

            {this.state.error && (
              <details className="mb-6 text-left bg-gray-50 rounded-lg p-4 max-h-48 overflow-auto">
                <summary className="font-semibold text-gray-700 cursor-pointer hover:text-gray-900">
                  {t("errorBoundary.errorDetails")}
                </summary>
                <pre className="mt-2 text-xs text-red-600 whitespace-pre-wrap break-words">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack && (
                    <div className="mt-2 text-gray-500">
                      {this.state.errorInfo.componentStack}
                    </div>
                  )}
                </pre>
              </details>
            )}

            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <RefreshCw className="w-5 h-5" />
                {t("errorBoundary.reset")}
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl border-2 border-gray-200 transition-all duration-200"
              >
                <Home className="w-5 h-5" />
                {t("errorBoundary.goHome")}
              </button>
            </div>

            <p className="mt-6 text-xs text-gray-400">
              {t("errorBoundary.persistHelp")}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
