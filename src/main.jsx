import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard.jsx'

import { Amplify } from 'aws-amplify';
import config_json from './exports';
import { Projects } from './pages/Projects.jsx'
import { ProjectEdit } from './pages/ProjectEdit.jsx'

Amplify.configure(config_json);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route index element={<Navigate to="/dashboard" />} />
      <Route path='dashboard' element={<Dashboard/>}/>
      <Route path='projects' element={<Projects/>}/>
      <Route path='projects/edit/:projectId' element={<ProjectEdit/>}/>
      {/* <Route path='blogs' element={<Blogs/>}/>
      <Route path='events' element={<Events/>}/>
      <Route path='partners' element={<Partners/>}/>
      <Route path='gallery' element={<Gallery/>}/> */}
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
