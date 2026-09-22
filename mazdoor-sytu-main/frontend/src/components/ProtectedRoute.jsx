function ProtectedRoute({ children, isAuthenticated = false }) { return isAuthenticated ? children : <p>Please sign in to continue.</p> }
export default ProtectedRoute
