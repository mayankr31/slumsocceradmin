import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Dashboard } from "./pages/Dashboard.jsx";

import { Amplify } from "aws-amplify";
import config_json from "./exports";
import { Projects } from "./pages/Projects.jsx";
import { ProjectEdit } from "./pages/ProjectEdit.jsx";
import { Blogs } from "./pages/Blogs.jsx";
import { Events } from "./pages/Events.jsx";
import BlogEdit from "./pages/BlogEdit.jsx";
import EventEdit from "./pages/EventEdit.jsx";
import { Gallery } from "./pages/Gallery.jsx";
import { GalleryForm } from "./pages/GalleryForm.jsx";

Amplify.configure(config_json);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Navigate to="/dashboard" />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="projects" element={<Projects />} />
      <Route path="projects/edit/:projectId" element={<ProjectEdit />} />
      <Route path="projects/new" element={<ProjectEdit />} />
      <Route path="blogs" element={<Blogs />} />
      <Route path="/blogs/new" element={<BlogEdit />} />
      <Route path="/blogs/edit/:blogId" element={<BlogEdit />} />
      <Route path="events" element={<Events />} />
      <Route path="/events/new" element={<EventEdit />} />
      <Route path="/events/edit/:eventId" element={<EventEdit />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/gallery/new" element={<GalleryForm />} />
      <Route path="/gallery/edit/:id" element={<GalleryForm />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
