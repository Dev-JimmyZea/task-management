import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ProtectedRoute } from "./components/ProtectedRoute";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <Home /> },
            { path: "tasks", element: <ProtectedRoute><Tasks /></ProtectedRoute> },
            { path: "login", element: <Login /> },
            { path: "signup", element: <Signup /> },
        ],
    },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}
