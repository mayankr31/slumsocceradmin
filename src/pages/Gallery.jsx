import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { listSlumsoccerGalleries } from "../graphql/queries";
import { deleteSlumsoccerGallery } from "../graphql/mutations";
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
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { generateClient } from "aws-amplify/api";

const client = generateClient();

export function Gallery() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  // Fetch galleries on component mount
  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const galleriesData = await client.graphql({
        query: listSlumsoccerGalleries,
        variables: { limit: 100 }
      });
      
      const galleryItems = galleriesData.data.listSlumsoccerGalleries.items;
      setGalleries(galleryItems);
      
    } catch (err) {
      console.error("Error fetching galleries:", err);
      setError("Failed to load galleries. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (gallery) => {
    setSelectedGallery(gallery);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await client.graphql({
        query: deleteSlumsoccerGallery,
        variables: {
          input: {
            galleryId: selectedGallery.galleryId
          }
        }
      });
      
      // Remove deleted gallery from state
      setGalleries(galleries.filter(g => g.galleryId !== selectedGallery.galleryId));
      setNotification({
        open: true,
        message: "Gallery item deleted successfully!",
        severity: "success"
      });
    } catch (err) {
      console.error("Error deleting gallery item:", err);
      setNotification({
        open: true,
        message: "Failed to delete gallery item. Please try again.",
        severity: "error"
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedGallery(null);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Filter galleries based on search term
  const filteredGalleries = galleries.filter(gallery => 
    searchTerm === "" || 
    gallery.title?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Gallery</h1>
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="text-gray-400" />
            </div>
            <TextField
              placeholder="Search gallery..."
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
          
          {/* View toggle buttons */}
          <div className="flex">
            <Button
              variant={viewMode === "grid" ? "contained" : "outlined"}
              onClick={() => setViewMode("grid")}
              style={{ textTransform: 'none', borderRadius: '8px 0 0 8px' }}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "contained" : "outlined"}
              onClick={() => setViewMode("list")}
              style={{ textTransform: 'none', borderRadius: '0 8px 8px 0' }}
            >
              List
            </Button>
          </div>
          
          {/* Add new gallery button */}
          <Link to="/gallery/new">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              style={{ textTransform: 'none', borderRadius: '8px' }}
            >
              Add Gallery Item
            </Button>
          </Link>
        </div>
      </div>

      {/* Gallery content - grid view */}
      {viewMode === "grid" && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
          {filteredGalleries.length > 0 ? (
            <ImageList variant="masonry" cols={3} gap={16}>
              {filteredGalleries.map((gallery) => (
                <ImageListItem key={gallery.galleryId} className="relative group">
                  <img
                    src={gallery.imgUrl || "https://via.placeholder.com/300x200?text=No+Image"}
                    alt={gallery.title}
                    loading="lazy"
                    style={{ borderRadius: '8px' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/300x200?text=Error+Loading+Image";
                    }}
                  />
                  <ImageListItemBar
                    title={gallery.title}
                    actionIcon={
                      <div className="hidden group-hover:flex space-x-1 mr-2">
                        <Tooltip title="Edit">
                          <Link to={`/gallery/edit/${gallery.galleryId}`}>
                            <IconButton size="small" sx={{ color: 'white' }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Link>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            size="small" 
                            sx={{ color: 'white' }}
                            onClick={() => handleDeleteClick(gallery)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    }
                  />
                </ImageListItem>
              ))}
            </ImageList>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500">No gallery items found</p>
              {searchTerm ? (
                <p className="text-sm text-gray-400 mt-2">
                  Try adjusting your search criteria
                </p>
              ) : (
                <Link to="/gallery/new">
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    startIcon={<AddIcon />}
                    style={{ marginTop: '16px', textTransform: 'none' }}
                  >
                    Add your first gallery item
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {/* Gallery content - list view */}
      {viewMode === "list" && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {filteredGalleries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredGalleries.map((gallery) => (
                    <tr key={gallery.galleryId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-12 w-16 rounded overflow-hidden bg-gray-100">
                          <img 
                            src={gallery.imgUrl} 
                            alt={gallery.title} 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/64x48?text=No+Image";
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{gallery.title || "Untitled"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Tooltip title="Edit">
                            <Link to={`/gallery/edit/${gallery.galleryId}`}>
                              <IconButton size="small" color="primary">
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Link>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton 
                              size="small" 
                              color="error" 
                              onClick={() => handleDeleteClick(gallery)}
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
              <p className="text-gray-500">No gallery items found</p>
              {searchTerm ? (
                <p className="text-sm text-gray-400 mt-2">
                  Try adjusting your search criteria
                </p>
              ) : (
                <Link to="/gallery/new">
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    startIcon={<AddIcon />}
                    style={{ marginTop: '16px', textTransform: 'none' }}
                  >
                    Add your first gallery item
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Gallery Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{selectedGallery?.title || 'this gallery item'}"? This action cannot be undone.
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