import React from 'react'

type State = { hasError: boolean; message?: string }

export default class ErrorBoundary extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: any) {
    // You can log the error to an external service here
    // console.error('ErrorBoundary caught', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, color: '#e6eef6', background: '#071021', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
          <h1>Something went wrong</h1>
          <p>{this.state.message}</p>
        </div>
      )
    }

    return this.props.children as React.ReactElement
  }
}
