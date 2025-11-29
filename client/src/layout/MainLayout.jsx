import { Outlet, Link } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white p-4 flex gap-4 shadow-lg">
        <Link to="/" className="hover:text-blue-200 transition-colors">Home</Link>
        <Link to="/about" className="hover:text-blue-200 transition-colors">About</Link>
      </nav>

      {/* Page Content - takes remaining height */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}