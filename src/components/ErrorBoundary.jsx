import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("App crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page-state">
          <h1>Something went wrong</h1>
          <p>Please refresh the page. If it keeps happening, contact support.</p>
          <button className="btn btn-primary" onClick={() => window.location.assign("/")}>
            Go to homepage
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
