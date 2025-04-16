  export default function LayoutDashboard({ children }) {
    return (
      <div className="min-h-screen bg-base-200 text-base-content p-4">
        <div className="max-w-7xl mx-auto card bg-base-100 p-6 shadow-xl space-y-6">
          <h1 className="text-3xl font-bold text-primary text-center">📋 Minutas Legislativas</h1>
          {children}
        </div>
      </div>
    );
  }
  