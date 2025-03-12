import React from "react";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CollectionsIcon from '@mui/icons-material/Collections';
import { IconButton } from "@mui/material";
import { NavLink } from "react-router-dom";

export function Sidebar({ isOpen, onToggle }) {
  const navItems = [
    { path: "/dashboard", name: "Dashboard", icon: DashboardIcon },
    { path: "/projects", name: "Projects", icon: FolderOpenIcon },
    { path: "/blogs", name: "Blogs", icon: ImportContactsIcon },
    { path: "/events", name: "Events", icon: EventNoteIcon },
    {path: '/gallery', name: 'Gallery', icon: CollectionsIcon},
  ];

  return (
    <div
      className={`bg-gray-900 text-white ${
        isOpen ? "w-64" : "w-20"
      } min-h-screen p-4 relative transition-all duration-300`}
    >
      <div
        className={`flex items-center ${
          isOpen ? "justify-between" : "justify-center"
        } mb-8`}
      >
        {isOpen && <div className="text-2xl font-bold pl-4">Admin</div>}
        {/* <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          aria-label={isOpen ? "Minimize Sidebar" : "Expand Sidebar"}
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button> */}
        <IconButton
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          aria-label={isOpen ? "Minimize Sidebar" : "Expand Sidebar"}
        >
          {isOpen ? (
            <ChevronLeftIcon  className="text-white text-[20px]" />
          ) : (
            <ChevronRightIcon className="text-white text-[20px]" />
          )}
        </IconButton>
      </div>
      <nav>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center ${
                  isOpen ? "space-x-3" : "justify-center"
                } px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`
              }
              title={!isOpen ? item.name : undefined}
            >
               <Icon sx={{ fontSize: 24 }} />
              {isOpen && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
