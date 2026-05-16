"use client"

import { Component } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="flex size-12 items-center justify-center bg-red-50 mb-4">
            <AlertTriangle className="size-6 text-red-500" />
          </span>
          <p className="font-heading text-base font-bold text-gray-900">Something went wrong</p>
          <p className="text-sm text-gray-500 mt-1 max-w-md">
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 transition-all"
          >
            <RefreshCw className="size-3.5" />
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
