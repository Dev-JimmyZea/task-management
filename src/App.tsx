import { Outlet, Link } from "react-router-dom";

export default function App() {
    return (
        <div className="min-h-screen flex flex-col">
            <nav className="bg-gray-800 text-white p-4 flex gap-4">
                <Link to="/">Home</Link>
                <Link to="/tasks">Tasks</Link>
                <Link to="/login">Login</Link>
            </nav>
            <main className="flex-1 p-4">
                <Outlet />
            </main>
        </div>
    );
}
