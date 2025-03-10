import { useState } from 'react'
import './App.css'
import {Outlet} from 'react-router-dom'
import { Sidebar } from './components/Sidebar'


function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  return (
     <div className="flex min-h-screen bg-gray-100">
        <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
  )
}

export default App
