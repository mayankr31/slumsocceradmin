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
import { Projects } from "./pages/projects/Projects.jsx";
import { ProjectEdit } from "./pages/projects/ProjectEdit.jsx";
import { Blogs } from "./pages/blogs/Blogs.jsx";
import { Events } from "./pages/events/Events.jsx";
import BlogEdit from "./pages/blogs/BlogEdit.jsx";
import EventEdit from "./pages/events/EventEdit.jsx";
import { Gallery } from "./pages/gallery/Gallery.jsx";
import { GalleryForm } from "./pages/gallery/GalleryForm.jsx";
import { Partners } from "./pages/partners/Partners.jsx";
import PartnerEdit from "./pages/partners/PartnerEdit.jsx";
import { News } from "./pages/news/News.jsx";
import NewsEdit from "./pages/news/NewsEdit.jsx";

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
      <Route path="/partners" element={<Partners/>}/>
      <Route path="/partners/new" element={<PartnerEdit/>}/>
      <Route path="/partners/edit/:partnerId" element={<PartnerEdit/>}/>
      <Route path="/news" element={<News/>}/>
      <Route path="/news/new" element={<NewsEdit/>}/>
      <Route path="/news/edit/:newsId" element={<NewsEdit/>}/>
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
