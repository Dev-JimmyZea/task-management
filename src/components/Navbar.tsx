import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

const Navbar = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/login");
    };

    return (
        <nav className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
            <div className="text-lg font-bold">
                <Link to="/">TaskManager</Link>
            </div>
            <div className="space-x-4">
                <Link to="/" className="hover:underline">Home</Link>
                {user ? (
                    <>
                        <Link to="/tasks" className="hover:underline">Tasks</Link>
                        <button onClick={handleLogout} className="hover:underline">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="hover:underline">Login</Link>
                        <Link to="/signup" className="hover:underline">Signup</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
