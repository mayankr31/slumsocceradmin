import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSlumsoccerPartners } from "../../graphql/queries";
import {
  createSlumsoccerPartners,
  updateSlumsoccerPartners,
} from "../../graphql/mutations";
import { v4 as uuidv4 } from "uuid";
import {
  Button,
  Box,
  TextField,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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

export default function PartnerEdit() {
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const isNewPartner = window.location.pathname.includes('/partners/new');

  const [partner, setPartner] = useState({
    partnerId: "",
    title: "",
    description: "",
    imgUrl: "",
    partnershipType: "",
    link: "",
  });

  const [loading, setLoading] = useState(!isNewPartner);
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
    if (!isNewPartner) {
      fetchPartner();
    } else {
      setPartner({
        partnerId: uuidv4(),
        title: "",
        description: "",
        imgUrl: "",
        partnershipType: "",
        link: "",
      });
    }
  }, [partnerId]);

  // Set image preview when imgUrl changes
  useEffect(() => {
    if (partner.imgUrl) {
      setImagePreview(partner.imgUrl);
    }
  }, [partner.imgUrl]);

  const fetchPartner = async () => {
    try {
      if (isNewPartner) {
        return;
      }

      setLoading(true);
      const response = await client.graphql({
        query: getSlumsoccerPartners,
        variables: { partnerId: partnerId },
      });

      const partnerData = response.data.getSlumsoccerPartners;
      if (partnerData) {
        setPartner(partnerData);
      } else {
        setError("Partner not found");
      }
    } catch (err) {
      console.error("Error fetching partner:", err);
      setError("Failed to load partner. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  console.log(partner);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPartner((prev) => ({ ...prev, [name]: value }));
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
      const fileName = `images/${uuidv4()}.${fileExtension}`;

      // Upload file to S3
      const result = await uploadData({
        key: fileName,
        data: file,
        options: {
          contentType: file.type,
        },
      }).result;

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
      if (!partner.title) {
        setNotification({
          open: true,
          message: "Partner title is required",
          severity: "error",
        });
        return;
      }

      if (!partner.partnershipType) {
        setNotification({
          open: true,
          message: "Partnership type is required",
          severity: "error",
        });
        return;
      }

      // Upload image to S3 if a new file is selected
      let finalImgUrl = partner.imgUrl;
      if (imageFile) {
        const uploadedUrl = await uploadImageToS3(imageFile);
        if (uploadedUrl) {
          finalImgUrl = uploadedUrl;
        } else {
          // If upload failed, keep using the existing URL or empty string
          finalImgUrl = partner.imgUrl || "";
        }
      }

      const input = {
        partnerId: partner.partnerId,
        title: partner.title,
        description: partner.description || "",
        imgUrl: finalImgUrl || "",
        partnershipType: partner.partnershipType,
        link: partner.link || "",
      };

      if (isNewPartner) {
        await client.graphql({
          query: createSlumsoccerPartners,
          variables: { input },
        });
        setNotification({
          open: true,
          message: "Partner created successfully!",
          severity: "success",
        });
      } else {
        await client.graphql({
          query: updateSlumsoccerPartners,
          variables: { input },
        });
        setNotification({
          open: true,
          message: "Partner updated successfully!",
          severity: "success",
        });
      }

      // Redirect after short delay
      setTimeout(() => {
        navigate("/partners");
      }, 1500);
    } catch (err) {
      console.error("Error saving partner:", err);
      setNotification({
        open: true,
        message: `Failed to ${
          isNewPartner ? "create" : "update"
        } partner. Please try again.`,
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setPartner((prev) => ({ ...prev, imgUrl: "" }));
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
          onClick={() => navigate("/partners")}
          style={{ marginTop: "16px" }}
        >
          Back to Partners
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
            onClick={() => navigate("/partners")}
            style={{ marginRight: "16px" }}
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold">
            {isNewPartner ? "Create New Partner" : "Edit Partner"}
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
            {saving ? "Saving..." : "Save Partner"}
          </Button>
        </div>
      </div>

      <Paper className="p-6">
        <Grid container spacing={3}>
          {/* Basic Partner Info */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Partner Name *"
              name="title"
              value={partner.title}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal" variant="outlined" required>
              <InputLabel id="partnership-type-label">Partnership Type</InputLabel>
              <Select
                labelId="partnership-type-label"
                id="partnershipType"
                name="partnershipType"
                value={partner.partnershipType}
                onChange={handleInputChange}
                label="Partnership Type"
              >
                <MenuItem value="present">present</MenuItem>
                <MenuItem value="past">past</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={partner.description}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              multiline
              rows={3}
              helperText="Brief description of the partnership"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Website Link"
              name="link"
              value={partner.link}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              helperText="Partner's website or social media link"
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
                  {uploadingImage ? "Uploading..." : "Upload Logo"}
                </Button>
              </label>

              {imagePreview && (
                <Box sx={{ mt: 2, position: "relative", width: "fit-content" }}>
                  <img
                    src={imagePreview}
                    alt="Partner logo preview"
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