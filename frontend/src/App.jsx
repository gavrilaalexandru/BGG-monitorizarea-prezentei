import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadUserFromStorage } from "./store/slices/authSlice";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import CreateEventGroup from "./pages/CreateEventGroup";
import EventGroupDetails from "./pages/EventGroupDetails";
import EventDetails from "./pages/EventDetails";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" /> : <AuthPage />}
      />

      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/" />}
      />

      <Route
        path="/events/create"
        element={
          user?.role === "ORGANIZER" ? (
            <CreateEventGroup />
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />

      <Route
        path="/events/group/:id"
        element={
          user?.role === "ORGANIZER" ? (
            <EventGroupDetails />
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />

      <Route
        path="/events/:id"
        element={
          user?.role === "ORGANIZER" ? (
            <EventDetails />
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />
    </Routes>
  );
}

export default App;
