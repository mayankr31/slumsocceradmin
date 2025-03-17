import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSlumsoccerNews } from "../../graphql/queries";
import {
  createSlumsoccerNews,
  updateSlumsoccerNews,
} from "../../graphql/mutations";
import { v4 as uuidv4 } from "uuid";
import {
  Button,
  Box,
  TextField,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  IconButton,
  Tooltip,
  Snackbar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { generateClient } from "aws-amplify/api";
import { uploadData } from "aws-amplify/storage";

const client = generateClient();

export default function NewsEdit() {
  const { newsId } = useParams();
  const navigate = useNavigate();
  const isNewNews = window.location.pathname.includes('/news/new');

  const [news, setNews] = useState({
    newsId: "",
    title: "",
    description: "",
    imgUrl: "",
    newspaper: "",
    link: "",
  });

  const [loading, setLoading] = useState(!isNewNews);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (!isNewNews) {
      fetchNews();
    } else {
      setNews({
        newsId: uuidv4(),
        title: "",
        description: "",
        imgUrl: "",
        newspaper: "",
        link: "",
      });
    }
  }, [newsId]);

  // Set image preview when imgUrl changes
  useEffect(() => {
    if (news.imgUrl) {
      setImagePreview(news.imgUrl);
    }
  }, [news.imgUrl]);

  const fetchNews = async () => {
    try {
      if (isNewNews) {
        return;
      }

      setLoading(true);
      const response = await client.graphql({
        query: getSlumsoccerNews,
        variables: { newsId: newsId },
      });

      const newsData = response.data.getSlumsoccerNews;
      if (newsData) {
        setNews(newsData);
      } else {
        setError("News not found");
      }
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Failed to load news. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNews((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);

      // Create a preview of the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToS3 = async (file) => {
    if (!file) return null;

    try {
      setUploadingImage(true);

      // Generate a unique file name with original extension
      const fileExtension = file.name.split(".").pop();
      const fileName = `news-images/${uuidv4()}.${fileExtension}`;

      // Upload file to S3
      const result = await uploadData({
        key: fileName,
        data: file,
        options: {
          contentType: file.type,
        },
      }).result;

      // Based on your S3 bucket, you might need to adjust this URL format
      const s3Url = `https://slumsoccer.s3.ap-south-1.amazonaws.com/${result.key}`;

      return s3Url;
    } catch (error) {
      console.error("Error uploading image to S3:", error);
      setNotification({
        open: true,
        message: "Failed to upload image. Please try again.",
        severity: "error",
      });
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Validate required fields
      if (!news.title) {
        setNotification({
          open: true,
          message: "News title is required",
          severity: "error",
        });
        return;
      }

      // Upload image to S3 if a new file is selected
      let finalImgUrl = news.imgUrl;
      if (imageFile) {
        const uploadedUrl = await uploadImageToS3(imageFile);
        if (uploadedUrl) {
          finalImgUrl = uploadedUrl;
        } else {
          // If upload failed, keep using the existing URL or empty string
          finalImgUrl = news.imgUrl || "";
        }
      }

      const input = {
        newsId: news.newsId,
        title: news.title,
        description: news.description || "",
        imgUrl: finalImgUrl || "",
        newspaper: news.newspaper || "",
        link: news.link || "",
        // Excluding ef1 as requested
      };

      if (isNewNews) {
        await client.graphql({
          query: createSlumsoccerNews,
          variables: { input },
        });
        setNotification({
          open: true,
          message: "News created successfully!",
          severity: "success",
        });
      } else {
        await client.graphql({
          query: updateSlumsoccerNews,
          variables: { input },
        });
        setNotification({
          open: true,
          message: "News updated successfully!",
          severity: "success",
        });
      }

      // Redirect after short delay
      setTimeout(() => {
        navigate("/news");
      }, 1500);
    } catch (err) {
      console.error("Error saving news:", err);
      setNotification({
        open: true,
        message: `Failed to ${
          isNewNews ? "create" : "update"
        } news. Please try again.`,
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setNews((prev) => ({ ...prev, imgUrl: "" }));
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

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
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/news")}
          style={{ marginTop: "16px" }}
        >
          Back to News
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/news")}
            style={{ marginRight: "16px" }}
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold">
            {isNewNews ? "Create New News" : "Edit News"}
          </h1>
        </div>
        <div className="space-x-2">
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={saving}
            style={{ textTransform: "none" }}
          >
            {saving ? "Saving..." : "Save News"}
          </Button>
        </div>
      </div>

      <Paper className="p-6">
        <Grid container spacing={3}>
          {/* Basic News Info */}
          <Grid item xs={12} md={6}>
            <TextField
              label="News Title *"
              name="title"
              value={news.title}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Newspaper/Source"
              name="newspaper"
              value={news.newspaper}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              helperText="Source of the news article"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={news.description}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              multiline
              rows={3}
              helperText="Brief description or summary of the news"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="News Link"
              name="link"
              value={news.link}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              helperText="URL to the original news article"
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                mt: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="image-file-upload"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="image-file-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  disabled={uploadingImage}
                  sx={{ mb: 2 }}
                >
                  {uploadingImage ? "Uploading..." : "Upload Image"}
                </Button>
              </label>

              {imagePreview && (
                <Box sx={{ mt: 2, position: "relative", width: "fit-content" }}>
                  <img
                    src={imagePreview}
                    alt="News image preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      objectFit: "contain",
                    }}
                  />
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={handleRemoveImage}
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 1)",
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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