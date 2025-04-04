import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
    return (
        <>
            <ToastContainer position="bottom-right" autoClose={3000} />
            <Navbar />
            <div className="p-4">
                <Outlet />
            </div>
        </>
    );
}
