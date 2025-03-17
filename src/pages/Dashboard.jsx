// import React, { useState, useEffect } from "react";
// import FolderOpenIcon from "@mui/icons-material/FolderOpen";
// import EventNoteIcon from "@mui/icons-material/EventNote";
// import ImportContactsIcon from "@mui/icons-material/ImportContacts";
// import CollectionsIcon from '@mui/icons-material/Collections';
// import HandshakeIcon from '@mui/icons-material/Handshake';
// import NewspaperIcon from '@mui/icons-material/Newspaper';
// import { DashboardCard } from "../components/DashboardCard";
// import { listSlumsoccerProjects, listSlumsoccerBlogs, listSlumsoccerEvents, listSlumsoccerGalleries, listSlumsoccerPartners, listSlumsoccerNews } from "../graphql/queries";
// // import { API } from "aws-amplify";
// import { CircularProgress } from "@mui/material";
// import { Alert } from "@mui/material";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import { generateClient } from "aws-amplify/api";

// const client = generateClient();


// export function Dashboard() {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState({
//     projects: { count: 0, items: [] },
//     blogs: { count: 0, items: [] },
//     events: { count: 0, items: [] },
//     gallery: {count: 0, items: []},
//     partners: {count: 0, items: []},
//     news: {count: 0, items: []},
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         // Fetch projects
//         const projectsData = await client.graphql({
//           query: listSlumsoccerProjects,
//           variables: { limit: 100 }
//         });
        
//         // Fetch blogs
//         const blogsData = await client.graphql({
//           query: listSlumsoccerBlogs,
//           variables: { limit: 100 }
//         });
        
//         // Fetch events
//         const eventsData = await client.graphql({
//           query: listSlumsoccerEvents,
//           variables: { limit: 100 }
//         });

//         const galleryData = await client.graphql({
//           query: listSlumsoccerGalleries,
//           variables: { limit: 100 }
//         });

//         const partnersData = await client.graphql({
//           query: listSlumsoccerPartners,
//           variables: { limit: 100 }
//         });

//         const newsData = await client.graphql({
//           query: listSlumsoccerNews,
//           variables: { limit: 100 }
//         });
        
//         setData({
//           projects: { 
//             count: projectsData.data.listSlumsoccerProjects.items.length,
//             items: projectsData.data.listSlumsoccerProjects.items
//           },
//           blogs: { 
//             count: blogsData.data.listSlumsoccerBlogs.items.length,
//             items: blogsData.data.listSlumsoccerBlogs.items
//           },
//           events: { 
//             count: eventsData.data.listSlumsoccerEvents.items.length,
//             items: eventsData.data.listSlumsoccerEvents.items
//           },
//           gallery: {
//             count: galleryData.data.listSlumsoccerGalleries.items.length,
//             items: galleryData.data.listSlumsoccerGalleries.items,
//           },
//           partners: {
//             count: partnersData.data.listSlumsoccerPartners.items.length,
//             items: partnersData.data.listSlumsoccerPartners.items,
//           },
//           news: {
//             count: newsData.data.listSlumsoccerNews.items.length,
//             items: newsData.data.listSlumsoccerNews.items,
//           },
//         });
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError("Failed to load dashboard data. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const summaryCards = [
//     {
//       title: "Projects",
//       count: data.projects.count,
//       icon: FolderOpenIcon,
//       path: "/projects",
//       color: "hover:text-blue-600",
//       bgColor: "bg-blue-50"
//     },
//     {
//       title: "Blogs",
//       count: data.blogs.count,
//       icon: ImportContactsIcon,
//       path: "/blogs",
//       color: "hover:text-purple-600",
//       bgColor: "bg-purple-50"
//     },
//     {
//       title: "Events",
//       count: data.events.count,
//       icon: EventNoteIcon,
//       path: "/events",
//       color: "hover:text-green-600",
//       bgColor: "bg-green-50"
//     },
//     {
//       title: "Gallery",
//       count: data.gallery.count,
//       icon: CollectionsIcon,
//       path: '/gallery',
//       color: "hover:text-red-600",
//       bgColor: "bg-red-50",
//     },
//     {
//       title: "Partners",
//       count: data.partners.count,
//       icon: HandshakeIcon,
//       path: '/partners',
//       color: "hover:text-red-600",
//       bgColor: "bg-red-50",
//     },
//     {
//       title: "News",
//       count: data.news.count,
//       icon: NewspaperIcon,
//       path: '/news',
//       color: "hover:text-red-600",
//       bgColor: "bg-red-50",
//     },
//   ];

//   // Data for the chart
//   const chartData = [
//     { name: 'Projects', count: data.projects.count, fill: '#3b82f6' },
//     { name: 'Blogs', count: data.blogs.count, fill: '#8b5cf6' },
//     { name: 'Events', count: data.events.count, fill: '#22c55e' },
//     { name: 'Gallery', count: data.gallery.count, fill: '#FFA500'},
//     { name: 'Partners', count: data.partners.count, fill: '#FFA500'},
//     { name: 'News', count: data.news.count, fill: '#FFA500'},
//   ];

//   if (loading) {
//     return (
//       <div className="p-6 flex justify-center items-center h-screen">
//         <CircularProgress />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6">
//         <Alert severity="error">{error}</Alert>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//         {summaryCards.map((card) => (
//           <DashboardCard key={card.title} {...card} />
//         ))}
//       </div>
      
//       {/* Chart */}
//       <div className="bg-white p-6 rounded-xl shadow-md mb-8">
//         <h2 className="text-lg font-semibold mb-4">Content Overview</h2>
//         <div className="h-64">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="count" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Recent Items Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Recent Projects */}
//         <div className="bg-white p-6 rounded-xl shadow-md">
//           <h2 className="text-lg font-semibold mb-4">Recent Projects</h2>
//           <div className="space-y-3">
//             {data.projects.items.slice(0, 5).map((project) => (
//               <div key={project.projectid} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
//                 <h3 className="font-medium">{project.title}</h3>
//                 <p className="text-sm text-gray-500 truncate">{project.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
        
//         {/* Recent Blogs */}
//         <div className="bg-white p-6 rounded-xl shadow-md">
//           <h2 className="text-lg font-semibold mb-4">Recent Blogs</h2>
//           <div className="space-y-3">
//             {data.blogs.items.slice(0, 5).map((blog) => (
//               <div key={blog.blogId} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
//                 <h3 className="font-medium">{blog.title}</h3>
//                 <p className="text-sm text-gray-500">{new Date(blog.date).toLocaleDateString()}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import CollectionsIcon from '@mui/icons-material/Collections';
import HandshakeIcon from '@mui/icons-material/Handshake';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import { DashboardCard } from "../components/DashboardCard";
import { listSlumsoccerProjects, listSlumsoccerBlogs, listSlumsoccerEvents, listSlumsoccerGalleries, listSlumsoccerPartners, listSlumsoccerNews } from "../graphql/queries";
// import { API } from "aws-amplify";
import { CircularProgress } from "@mui/material";
import { Alert } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateClient } from "aws-amplify/api";

const client = generateClient();


export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    projects: { count: 0, items: [] },
    blogs: { count: 0, items: [] },
    events: { count: 0, items: [] },
    gallery: {count: 0, items: []},
    partners: {count: 0, items: []},
    news: {count: 0, items: []},
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch projects
        const projectsData = await client.graphql({
          query: listSlumsoccerProjects,
          variables: { limit: 100 }
        });
        
        // Fetch blogs
        const blogsData = await client.graphql({
          query: listSlumsoccerBlogs,
          variables: { limit: 100 }
        });
        
        // Fetch events
        const eventsData = await client.graphql({
          query: listSlumsoccerEvents,
          variables: { limit: 100 }
        });

        const galleryData = await client.graphql({
          query: listSlumsoccerGalleries,
          variables: { limit: 100 }
        });

        const partnersData = await client.graphql({
          query: listSlumsoccerPartners,
          variables: { limit: 100 }
        });

        const newsData = await client.graphql({
          query: listSlumsoccerNews,
          variables: { limit: 100 }
        });
        
        setData({
          projects: { 
            count: projectsData.data.listSlumsoccerProjects.items.length,
            items: projectsData.data.listSlumsoccerProjects.items
          },
          blogs: { 
            count: blogsData.data.listSlumsoccerBlogs.items.length,
            items: blogsData.data.listSlumsoccerBlogs.items
          },
          events: { 
            count: eventsData.data.listSlumsoccerEvents.items.length,
            items: eventsData.data.listSlumsoccerEvents.items
          },
          gallery: {
            count: galleryData.data.listSlumsoccerGalleries.items.length,
            items: galleryData.data.listSlumsoccerGalleries.items,
          },
          partners: {
            count: partnersData.data.listSlumsoccerPartners.items.length,
            items: partnersData.data.listSlumsoccerPartners.items,
          },
          news: {
            count: newsData.data.listSlumsoccerNews.items.length,
            items: newsData.data.listSlumsoccerNews.items,
          },
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const summaryCards = [
    {
      title: "Projects",
      count: data.projects.count,
      icon: FolderOpenIcon,
      path: "/projects",
      color: "hover:text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Blogs",
      count: data.blogs.count,
      icon: ImportContactsIcon,
      path: "/blogs",
      color: "hover:text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Events",
      count: data.events.count,
      icon: EventNoteIcon,
      path: "/events",
      color: "hover:text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Gallery",
      count: data.gallery.count,
      icon: CollectionsIcon,
      path: '/gallery',
      color: "hover:text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Partners",
      count: data.partners.count,
      icon: HandshakeIcon,
      path: '/partners',
      color: "hover:text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      title: "News",
      count: data.news.count,
      icon: NewspaperIcon,
      path: '/news',
      color: "hover:text-rose-600",
      bgColor: "bg-rose-50",
    },
  ];

  // Data for the chart
  const chartData = [
    { name: 'Projects', count: data.projects.count, fill: '#3b82f6' },  // Blue
    { name: 'Blogs', count: data.blogs.count, fill: '#8b5cf6' },        // Purple
    { name: 'Events', count: data.events.count, fill: '#22c55e' },      // Green
    { name: 'Gallery', count: data.gallery.count, fill: '#f59e0b' },    // Amber
    { name: 'Partners', count: data.partners.count, fill: '#06b6d4' },  // Cyan
    { name: 'News', count: data.news.count, fill: '#e11d48' },          // Rose
  ];

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {summaryCards.map((card) => (
          <DashboardCard key={card.title} {...card} />
        ))}
      </div>
      
      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-lg font-semibold mb-4">Content Overview</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill={(entry) => entry.fill} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Items Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Recent Projects</h2>
          <div className="space-y-3">
            {data.projects.items.slice(0, 5).map((project) => (
              <div key={project.projectid} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                <h3 className="font-medium">{project.title}</h3>
                <p className="text-sm text-gray-500 truncate">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recent Blogs */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Recent Blogs</h2>
          <div className="space-y-3">
            {data.blogs.items.slice(0, 5).map((blog) => (
              <div key={blog.blogId} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                <h3 className="font-medium">{blog.title}</h3>
                <p className="text-sm text-gray-500">{new Date(blog.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}