import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Login from "./pages/Login";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <Home /> },
            { path: "tasks", element: <Tasks /> },
            { path: "login", element: <Login /> },
        ],
    },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}
