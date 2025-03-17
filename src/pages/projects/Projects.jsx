import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import { API } from "aws-amplify";
import { listSlumsoccerProjects, getSlumsoccerProjects } from "../../graphql/queries";
import { deleteSlumsoccerProjects } from "../../graphql/mutations";
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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import { generateClient } from "aws-amplify/api";

const client = generateClient();

export function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [projectTypes, setProjectTypes] = useState([]);

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await client.graphql({
        query: listSlumsoccerProjects,
        variables: { limit: 100 }
      });
      
      const projectItems = projectsData.data.listSlumsoccerProjects.items;
      setProjects(projectItems);
      
      // Extract unique project types for filtering
      const types = [...new Set(projectItems.map(project => project.projectType))].filter(Boolean);
      setProjectTypes(types);
      
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (project) => {
    setSelectedProject(project);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await client.graphql({
        query: deleteSlumsoccerProjects,
        variables: {
          input: {
            projectid: selectedProject.projectid
          }
        }
      });
      
      // Remove deleted project from state
      setProjects(projects.filter(p => p.projectid !== selectedProject.projectid));
      setNotification({
        open: true,
        message: "Project deleted successfully!",
        severity: "success"
      });
    } catch (err) {
      console.error("Error deleting project:", err);
      setNotification({
        open: true,
        message: "Failed to delete project. Please try again.",
        severity: "error"
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedProject(null);
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

  const handleFilterSelect = (type) => {
    setFilterType(type);
    setAnchorEl(null);
  };

  const clearFilter = () => {
    setFilterType(null);
    setAnchorEl(null);
  };

  // Filter and search projects
  const filteredProjects = projects
    .filter(project => !filterType || project.projectType === filterType)
    .filter(project => 
      searchTerm === "" || 
      project.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      project.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Projects</h1>
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="text-gray-400" />
            </div>
            <TextField
              placeholder="Search projects..."
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
              {filterType || "Filter"}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleFilterMenuClose}
            >
              {projectTypes.map((type) => (
                <MenuItem key={type} onClick={() => handleFilterSelect(type)}>
                  {type}
                </MenuItem>
              ))}
              {filterType && (
                <MenuItem onClick={clearFilter}>
                  <span className="text-red-500">Clear Filter</span>
                </MenuItem>
              )}
            </Menu>
          </div>
          
          {/* Add new project button */}
          <Link to="/projects/new">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              style={{ textTransform: 'none', borderRadius: '8px' }}
            >
              Add Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Project list */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {filteredProjects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProjects.map((project) => (
                  <tr key={project.projectid} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {project.imgUrl ? (
                          <div className="h-10 w-10 rounded-md overflow-hidden mr-3">
                            <img 
                              src={project.imgUrl} 
                              alt={project.title} 
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
                        <div className="font-medium text-gray-900">{project.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {project.projectType ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {project.projectType}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {project.description || "No description available"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Tooltip title="Edit">
                          <Link to={`/projects/edit/${project.projectid}`}>
                            <IconButton size="small" color="primary">
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Link>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => handleDeleteClick(project)}
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
            <p className="text-gray-500">No projects found</p>
            {searchTerm || filterType ? (
              <p className="text-sm text-gray-400 mt-2">
                Try adjusting your search or filter criteria
              </p>
            ) : (
              <Link to="/projects/new">
                <Button 
                  variant="outlined" 
                  color="primary" 
                  startIcon={<AddIcon />}
                  style={{ marginTop: '16px', textTransform: 'none' }}
                >
                  Add your first project
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
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{selectedProject?.title}"? This action cannot be undone.
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
