import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { listSlumsoccerBlogs, getSlumsoccerBlogs } from "../graphql/queries";
import { deleteSlumsoccerBlogs } from "../graphql/mutations";
import {
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import { generateClient } from "aws-amplify/api";

const client = generateClient();

export function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterDate, setFilterDate] = useState(null);
  const [datePeriods, setDatePeriods] = useState([]);

  // Fetch blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const blogsData = await client.graphql({
        query: listSlumsoccerBlogs,
        variables: { limit: 100 }
      });
      
      const blogItems = blogsData.data.listSlumsoccerBlogs.items;
      setBlogs(blogItems);
      
      // Extract unique months for filtering
      const dates = [...new Set(blogItems.map(blog => {
        if (!blog.date) return null;
        const date = new Date(blog.date);
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
      }))].filter(Boolean);
      
      setDatePeriods(dates);
      
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to load blogs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (blog) => {
    setSelectedBlog(blog);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await client.graphql({
        query: deleteSlumsoccerBlogs,
        variables: {
          input: {
            blogId: selectedBlog.blogId
          }
        }
      });
      
      // Remove deleted blog from state
      setBlogs(blogs.filter(b => b.blogId !== selectedBlog.blogId));
      setNotification({
        open: true,
        message: "Blog deleted successfully!",
        severity: "success"
      });
    } catch (err) {
      console.error("Error deleting blog:", err);
      setNotification({
        open: true,
        message: "Failed to delete blog. Please try again.",
        severity: "error"
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedBlog(null);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleFilterMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFilterSelect = (period) => {
    setFilterDate(period);
    setAnchorEl(null);
  };

  const clearFilter = () => {
    setFilterDate(null);
    setAnchorEl(null);
  };

  const getFormattedDate = (dateString) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getMonthYearFromDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // Filter and search blogs
  const filteredBlogs = blogs
    .filter(blog => !filterDate || getMonthYearFromDate(blog.date) === filterDate)
    .filter(blog => 
      searchTerm === "" || 
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      blog.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Blogs</h1>
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="text-gray-400" />
            </div>
            <TextField
              placeholder="Search blogs..."
              variant="outlined"
              size="small"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                style: { paddingLeft: '35px', borderRadius: '8px' }
              }}
            />
          </div>
          
          {/* Filter button */}
          <div>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={handleFilterMenuOpen}
              style={{ textTransform: 'none' }}
            >
              {filterDate || "Filter by date"}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleFilterMenuClose}
            >
              {datePeriods.map((period) => (
                <MenuItem key={period} onClick={() => handleFilterSelect(period)}>
                  {period}
                </MenuItem>
              ))}
              {filterDate && (
                <MenuItem onClick={clearFilter}>
                  <span className="text-red-500">Clear Filter</span>
                </MenuItem>
              )}
            </Menu>
          </div>
          
          {/* Add new blog button */}
          <Link to="/blogs/new">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              style={{ textTransform: 'none', borderRadius: '8px' }}
            >
              Add Blog
            </Button>
          </Link>
        </div>
      </div>

      {/* Blog list */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {filteredBlogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blog</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBlogs.map((blog) => (
                  <tr key={blog.blogId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {blog.imgUrl ? (
                          <div className="h-10 w-10 rounded-md overflow-hidden mr-3">
                            <img 
                              src={blog.imgUrl} 
                              alt={blog.title} 
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/40?text=No+Image";
                              }}
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-gray-200 mr-3 flex items-center justify-center text-gray-500">
                            ?
                          </div>
                        )}
                        <div className="font-medium text-gray-900">{blog.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        {getFormattedDate(blog.date)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {blog.description || "No description available"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Tooltip title="Edit">
                          <Link to={`/blogs/edit/${blog.blogId}`}>
                            <IconButton size="small" color="primary">
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Link>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => handleDeleteClick(blog)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">No blogs found</p>
            {searchTerm || filterDate ? (
              <p className="text-sm text-gray-400 mt-2">
                Try adjusting your search or filter criteria
              </p>
            ) : (
              <Link to="/blogs/new">
                <Button 
                  variant="outlined" 
                  color="primary" 
                  startIcon={<AddIcon />}
                  style={{ marginTop: '16px', textTransform: 'none' }}
                >
                  Add your first blog
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Blog</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{selectedBlog?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
}