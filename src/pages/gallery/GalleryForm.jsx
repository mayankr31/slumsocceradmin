import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  CircularProgress,
  Paper,
  Grid,
  Typography,
  Divider,
  Alert,
  Snackbar,
  Box,
  IconButton,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { generateClient } from "aws-amplify/api";
import { getSlumsoccerGallery } from "../../graphql/queries";
import { createSlumsoccerGallery, updateSlumsoccerGallery } from "../../graphql/mutations";
import { v4 as uuidv4 } from "uuid"; // You'll need to install this package

const client = generateClient();

export function GalleryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    galleryId: "",
    title: "",
    imgUrl: "",
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [previewImage, setPreviewImage] = useState("");

  // Fetch gallery data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchGalleryData();
    } else {
      // Generate a new UUID for new gallery items
      setFormData({
        ...formData,
        galleryId: uuidv4()
      });
    }
  }, [id]);

  const fetchGalleryData = async () => {
    try {
      setLoading(true);
      const response = await client.graphql({
        query: getSlumsoccerGallery,
        variables: { galleryId: id }
      });
      
      const galleryData = response.data.getSlumsoccerGallery;
      if (galleryData) {
        setFormData(galleryData);
        setPreviewImage(galleryData.imgUrl);
      } else {
        setError("Gallery item not found");
      }
    } catch (err) {
      console.error("Error fetching gallery item:", err);
      setError("Failed to load gallery item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData({
      ...formData,
      imgUrl: url
    });
    setPreviewImage(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.title || !formData.imgUrl) {
      setNotification({
        open: true,
        message: "Please fill out all required fields",
        severity: "error"
      });
      return;
    }
    
    try {
      setSaving(true);
      
      if (isEditMode) {
        // Update existing gallery item
        await client.graphql({
          query: updateSlumsoccerGallery,
          variables: {
            input: {
              galleryId: formData.galleryId,
              title: formData.title,
              imgUrl: formData.imgUrl,
            }
          }
        });
        
        setNotification({
          open: true,
          message: "Gallery item updated successfully!",
          severity: "success"
        });
      } else {
        // Create new gallery item
        await client.graphql({
          query: createSlumsoccerGallery,
          variables: {
            input: {
              galleryId: formData.galleryId,
              title: formData.title,
              imgUrl: formData.imgUrl,
            }
          }
        });
        
        setNotification({
          open: true,
          message: "Gallery item created successfully!",
          severity: "success"
        });
      }
      
      // Redirect after a short delay to allow user to see the success message
      setTimeout(() => {
        navigate("/gallery");
      }, 1500);
      
    } catch (err) {
      console.error("Error saving gallery item:", err);
      setNotification({
        open: true,
        message: `Failed to ${isEditMode ? "update" : "create"} gallery item. Please try again.`,
        severity: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/gallery")}
          variant="outlined"
          style={{ textTransform: 'none' }}
        >
          Back to Gallery
        </Button>
      </div>

      <Paper elevation={3} className="p-6">
        <Typography variant="h5" component="h1" className="mb-6">
          {isEditMode ? "Edit Gallery Item" : "Add New Gallery Item"}
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Left column - Form Fields */}
            <Grid item xs={12} md={7}>
              <div className="space-y-4">
                <TextField
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                />
                
                <TextField
                  label="Image URL"
                  name="imgUrl"
                  value={formData.imgUrl}
                  onChange={handleImageUrlChange}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  helperText="Enter a direct URL to the image"
                />
              </div>
            </Grid>
            
            {/* Right column - Image Preview */}
            <Grid item xs={12} md={5}>
              <Paper variant="outlined" className="p-4">
                <Typography variant="subtitle1" className="mb-2">
                  Image Preview
                </Typography>
                <Divider className="mb-4" />
                <div className="flex justify-center">
                  {previewImage ? (
                    <div className="relative">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="max-w-full max-h-60 object-contain rounded"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/300x200?text=Invalid+Image+URL";
                        }}
                      />
                    </div>
                  ) : (
                    <Box
                      className="w-full h-60 flex items-center justify-center bg-gray-100 rounded"
                    >
                      <Typography variant="body2" color="textSecondary">
                        No image preview available
                      </Typography>
                    </Box>
                  )}
                </div>
              </Paper>
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" className="mt-6">
              {error}
            </Alert>
          )}

          <div className="mt-8 flex justify-end space-x-3">
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => navigate("/gallery")}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={saving}
              startIcon={saving && <CircularProgress size={20} color="inherit" />}
            >
              {saving
                ? "Saving..."
                : isEditMode
                ? "Update Gallery Item"
                : "Create Gallery Item"}
            </Button>
          </div>
        </form>
      </Paper>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
}