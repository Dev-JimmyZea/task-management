import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/login");
    };

    return (
        <div className="max-w-md mx-auto mt-10 space-y-4 text-center">
            <h1 className="text-2xl font-bold">Welcome {user?.email || "Guest"}</h1>

            {user ? (
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                    Logout
                </button>
            ) : (
                <p className="text-gray-600">Please log in to see your tasks.</p>
            )}
        </div>
    );
};

export default Home;
