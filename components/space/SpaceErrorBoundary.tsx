'use client'

import React from 'react'

interface SpaceErrorBoundaryProps {
  children: React.ReactNode
}

interface SpaceErrorBoundaryState {
  hasError: boolean
  errorMessage?: string
}

export default class SpaceErrorBoundary extends React.Component<
  SpaceErrorBoundaryProps,
  SpaceErrorBoundaryState
> {
  state: SpaceErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError(error: Error): SpaceErrorBoundaryState {
    return { hasError: true, errorMessage: error?.message }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[space] boundary caught error', error, info.componentStack)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: undefined })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-4 glass rounded-2xl border border-purple-500/40 p-8 my-8">
          <div className="text-4xl" aria-hidden>
            🛰️
          </div>
          <h2 className="text-2xl font-bold text-white">Space module recovered</h2>
          <p className="text-gray-300 max-w-xl">
            حدثت مشكلة أثناء تحميل محتوى الفضاء. جرّب إعادة المحاولة أو تحديث الصفحة. تم تفعيل
            وضع الحماية حتى لا تنهار الصفحة في حال كان ملف البيانات مفقوداً أو غير مكتمل.
          </p>
          {this.state.errorMessage && (
            <p className="text-sm text-purple-200/80">التفاصيل: {this.state.errorMessage}</p>
          )}
          <div className="flex gap-3">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 rounded-lg border border-purple-400/60 text-purple-100 hover:border-purple-300 transition-colors"
            >
              إعادة المحاولة
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg border border-blue-400/60 text-blue-100 hover:border-blue-300 transition-colors"
            >
              تحديث الصفحة
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
