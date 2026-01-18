import React from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false, 
            error: null,
            errorInfo: null 
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    handleReload = () => {
        window.location.reload();
    }

    handleGoHome = () => {
        window.location.href = '/';
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary-container">
                    <div className="error-boundary-content">
                        <div className="error-icon">😵</div>
                        <h1>Oops! Có lỗi xảy ra</h1>
                        <p className="error-message">
                            Xin lỗi vì sự bất tiện này. Đã có lỗi không mong muốn xảy ra.
                        </p>
                        
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="error-details">
                                <summary>Chi tiết lỗi (Development only)</summary>
                                <pre className="error-stack">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}

                        <div className="error-actions">
                            <button onClick={this.handleReload} className="btn-reload">
                                🔄 Tải lại trang
                            </button>
                            <button onClick={this.handleGoHome} className="btn-home">
                                🏠 Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
