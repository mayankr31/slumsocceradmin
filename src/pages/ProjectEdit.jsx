import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { API } from "aws-amplify";
import { getSlumsoccerProjects } from "../graphql/queries";
import {
  createSlumsoccerProjects,
  updateSlumsoccerProjects,
} from "../graphql/mutations";
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
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Snackbar,
} from "@mui/material";
// import Grid from '@mui/material/Grid2';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import BoldIcon from "@mui/icons-material/FormatBold";
import ItalicIcon from "@mui/icons-material/FormatItalic";
import UnderlineIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughIcon from "@mui/icons-material/StrikethroughS";
import CodeIcon from "@mui/icons-material/Code";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import LinkIcon from "@mui/icons-material/Link";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import FormatClearIcon from "@mui/icons-material/FormatClear";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import { generateClient } from "aws-amplify/api";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { uploadData } from "aws-amplify/storage";
import { mergeAttributes } from "@tiptap/core";
import Heading from "@tiptap/extension-heading";

const client = generateClient();

// Editor menu button component
const MenuButton = ({ onClick, active, disabled, children, title }) => (
  <Tooltip title={title}>
    <IconButton
      onClick={onClick}
      color={active ? "primary" : "default"}
      disabled={disabled}
      size="small"
      className={`m-1 ${active ? "bg-blue-50" : ""}`}
    >
      {children}
    </IconButton>
  </Tooltip>
);




export function ProjectEdit() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const isNewProject = projectId === "new";

  const [project, setProject] = useState({
    projectid: "",
    title: "",
    projectType: "",
    description: "",
    hoverText: "",
    imgUrl: "",
    mainContent: { html: "" },
  });

  const [loading, setLoading] = useState(!isNewProject);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  // const [previewMode, setPreviewMode] = useState(false);
  const [projectTypes] = useState([
    "Empowerment",
    "Leadership",
    "Popular",
    "Tournament",
    "Featured",
  ]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [editorContent, setEditorContent] = useState("");

  const editorCSS = {
    h1: "block text-[2em] mt-[0.67em] mb-[0.67em] mx-0 font-bold [unicode-bidi:isolate]",
    h2: "block text-[1.5em] mt-[0.83em] mb-[0.83em] mx-0 font-bold [unicode-bidi:isolate]",
    h3: "block text-[1.17em] mt-[1em] mb-[1em] mx-0 font-bold [unicode-bidi:isolate]",
    blockquote: "block mt-[1em] mb-[1em] mx-[40px] [unicode-bidi:isolate]",
    ul: "block list-disc mt-[1em] mb-[1em] mx-0 pl-[40px] [unicode-bidi:isolate]",
    ol: "block list-decimal mt-[1em] mb-[1em] mx-0 pl-[40px] [unicode-bidi:isolate]",
    li: "list-item text-left [unicode-bidi:isolate]",
    p: "block mt-[1em] mb-[1em] mx-0 [unicode-bidi:isolate]",
  };

  const CustomHeading = Heading.extend({
    renderHTML({ node, HTMLAttributes }) {
      const level = node.attrs.level;
      
      // Define level-specific attributes
      const levelAttributes = {
        1: { class: editorCSS.h1 },
        2: { class: editorCSS.h2 },
        3: { class: editorCSS.h3 },
      };
  
      // Merge default HTML attributes with level-specific ones
      return [
        `h${level}`,
        mergeAttributes(levelAttributes[level] || {}, HTMLAttributes),
        0,
      ];
    },
  });

  
  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
      StarterKit.configure({
        bulletList: {
          HTMLAttributes:{
            class: editorCSS.ul,
          }
        },
        orderedList: {
          HTMLAttributes:{
            class: editorCSS.ol,
          }
        },
        blockquote: {
          HTMLAttributes:{
            class: editorCSS.blockquote,
          }
        },
        listItem:{
          HTMLAttributes:{
            class: editorCSS.li,
          }
        },
        paragraph:{
          HTMLAttributes:{
            class: editorCSS.p,
          }
        },
      }),
      CustomHeading,
      Placeholder.configure({
        placeholder: "Write your content here...",
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        inline: true,
      }),
    ],
    content: project.mainContent
      ? typeof project.mainContent === "string" &&
        project.mainContent.trim() !== ""
        ? JSON.parse(project.mainContent).html
        : ""
      : "",
    onUpdate: ({ editor }) => {
      setProject((prev) => ({
        ...prev,
        mainContent: JSON.stringify(JSON.stringify({ html: editor.getHTML() })),
      }));
      setEditorContent(editor.getHTML());
    },
  });

  // Fetch project data if editing an existing project
  useEffect(() => {
    if (!isNewProject) {
      fetchProject();
    } else {
      setProject({
        projectid: uuidv4(),
        title: "",
        projectType: "",
        description: "",
        hoverText: "",
        imgUrl: "",
        mainContent: { html: "" },
      });
    }
  }, [projectId]);

  // Update editor content when project data changes
  useEffect(() => {
    console.log(editorContent);

    if (editor && project.mainContent) {
      try {
        const contentObj = JSON.parse(JSON.parse(project.mainContent));
        if (contentObj && contentObj.html) {
          editor.commands.setContent(contentObj.html);
        }
      } catch (err) {
        // Handle case where mainContent might not be in JSON format yet
        console.warn("Error parsing mainContent:", err);
        editor.commands.setContent(project.mainContent.html);
      }
    }
  }, [editor, project.mainContent]);

  // Set image preview when imgUrl changes
  useEffect(() => {
    if (project.imgUrl) {
      setImagePreview(project.imgUrl);
    }
  }, [project.imgUrl]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await client.graphql({
        query: getSlumsoccerProjects,
        variables: { projectid: projectId },
      });

      const projectData = response.data.getSlumsoccerProjects;
      if (projectData) {
        setProject(projectData);
      } else {
        setError("Project not found");
      }
    } catch (err) {
      console.error("Error fetching project:", err);
      setError("Failed to load project. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
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

      // Get the S3 URL for the uploaded file
      // Note: This is a common S3 URL pattern, adjust as needed for your S3 configuration
      // const s3Url = `https://your-bucket-name.s3.amazonaws.com/${fileName}`;
      // const s3Url = `https://slumsoccer.s3.ap-south-1.amazonaws.com/${filename}`;
      const s3Url = `https://slumsoccer.s3.ap-south-1.amazonaws.com/${result.key}`;

      // Alternatively, you can use the Storage.get method to get the URL:
      // const { getUrl } = await import("aws-amplify/storage");
      // const { url } = await getUrl({ key: fileName });

      // return url;
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
      if (!project.title) {
        setNotification({
          open: true,
          message: "Project title is required",
          severity: "error",
        });
        return;
      }

      // Upload image to S3 if a new file is selected
      let finalImgUrl = project.imgUrl;
      if (imageFile) {
        const uploadedUrl = await uploadImageToS3(imageFile);
        if (uploadedUrl) {
          finalImgUrl = uploadedUrl;
        } else {
          // If upload failed, keep using the existing URL or empty string
          finalImgUrl = project.imgUrl || "";
        }
      }

      const input = {
        projectid: project.projectid,
        title: project.title,
        projectType: project.projectType,
        description: project.description || "",
        hoverText: project.hoverText || "",
        // imgUrl: project.imgUrl || "",
        imgUrl: finalImgUrl || "",
        mainContent:
          typeof project.mainContent === "string"
            ? project.mainContent
            : JSON.stringify(
                JSON.stringify({ html: project.mainContent || "" })
              ),
      };

      if (isNewProject) {
        await client.graphql({
          query: createSlumsoccerProjects,
          variables: { input },
        });
        setNotification({
          open: true,
          message: "Project created successfully!",
          severity: "success",
        });
      } else {
        await client.graphql({
          query: updateSlumsoccerProjects,
          variables: { input },
        });
        setNotification({
          open: true,
          message: "Project updated successfully!",
          severity: "success",
        });
      }

      // Redirect after short delay
      setTimeout(() => {
        navigate("/projects");
      }, 1500);
    } catch (err) {
      console.error("Error saving project:", err);
      setNotification({
        open: true,
        message: `Failed to ${
          isNewProject ? "create" : "update"
        } project. Please try again.`,
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setProject((prev) => ({ ...prev, imgUrl: "" }));
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Editor toolbar handlers
  const addLink = () => {
    const url = window.prompt("URL");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
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
          onClick={() => navigate("/projects")}
          style={{ marginTop: "16px" }}
        >
          Back to Projects
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
            onClick={() => navigate("/projects")}
            style={{ marginRight: "16px" }}
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold ">
            {isNewProject ? "Create New Project" : "Edit Project"}
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
            {saving ? "Saving..." : "Save Project"}
          </Button>
        </div>
      </div>

      <Paper className="p-6">
        <Grid container spacing={3}>
          {/* Basic Project Info */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Project Title *"
              name="title"
              value={project.title}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel id="project-type-label">Project Type</InputLabel>
              <Select
                labelId="project-type-label"
                id="projectType"
                name="projectType"
                value={project.projectType}
                onChange={handleInputChange}
                label="Project Type"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {projectTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={project.description}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              multiline
              rows={2}
              helperText="Brief description of the project"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Hover Text"
              name="hoverText"
              value={project.hoverText}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              helperText="Text to show on hover (optional)"
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
                    alt="Project preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "300px",
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

        {/* Content Editor */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">Project Content</h2>

          <div className="bg-gray-50 p-2 rounded-t-lg border border-gray-300 flex flex-wrap">
            <MenuButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor?.isActive("bold")}
              disabled={!editor}
              title="Bold"
            >
              <BoldIcon fontSize="small" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor?.isActive("italic")}
              disabled={!editor}
              title="Italic"
            >
              <ItalicIcon fontSize="small" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              active={editor?.isActive("strike")}
              disabled={!editor}
              title="Strikethrough"
            >
              <StrikethroughIcon fontSize="small" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              active={editor?.isActive("code")}
              disabled={!editor}
              title="Inline Code"
            >
              <CodeIcon fontSize="small" />
            </MenuButton>
            <Divider
              orientation="vertical"
              flexItem
              style={{ margin: "0 8px" }}
            />
            <MenuButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              active={editor?.isActive("heading", { level: 1 })}
              disabled={!editor}
              title="Heading 1"
            >
              H1
            </MenuButton>

            <MenuButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              active={editor?.isActive("heading", { level: 2 })}
              disabled={!editor}
              title="Heading 2"
            >
              H2
            </MenuButton>
            <MenuButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              active={editor?.isActive("heading", { level: 3 })}
              disabled={!editor}
              title="Heading 3"
            >
              H3
            </MenuButton>
            <Divider
              orientation="vertical"
              flexItem
              style={{ margin: "0 8px" }}
            />
            <MenuButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor?.isActive("bulletList")}
              disabled={!editor}
              title="Bullet List"
            >
              <FormatListBulletedIcon fontSize="small" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor?.isActive("orderedList")}
              disabled={!editor}
              title="Numbered List"
            >
              <FormatListNumberedIcon fontSize="small" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              active={editor?.isActive("blockquote")}
              disabled={!editor}
              title="Quote"
            >
              <FormatQuoteIcon fontSize="small" />
            </MenuButton>
            <Divider
              orientation="vertical"
              flexItem
              style={{ margin: "0 8px" }}
            />
            <MenuButton
              onClick={addLink}
              active={editor?.isActive("link")}
              disabled={!editor}
              title="Add Link"
            >
              <LinkIcon fontSize="small" />
            </MenuButton>
            <MenuButton onClick={addImage} disabled={!editor} title="Add Image">
              <InsertPhotoIcon fontSize="small" />
            </MenuButton>
            <Divider
              orientation="vertical"
              flexItem
              style={{ margin: "0 8px" }}
            />
            <MenuButton
              onClick={() => editor.chain().focus().unsetAllMarks().run()}
              disabled={!editor}
              title="Clear Formatting"
            >
              <FormatClearIcon fontSize="small" />
            </MenuButton>
            <Divider
              orientation="vertical"
              flexItem
              style={{ margin: "0 8px" }}
            />
            <div className="flex justify-end mt-2">
              <MenuButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor || !editor.can().undo()}
                title="Undo"
              >
                <UndoIcon fontSize="small" />
              </MenuButton>
              <MenuButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor || !editor.can().redo()}
                title="Redo"
              >
                <RedoIcon fontSize="small" />
              </MenuButton>
            </div>
          </div>

          <div className="border border-gray-300 rounded-b-lg min-h-[300px]">
            <EditorContent editor={editor} className="p-4 focus:outline-none" />
          </div>
          
        </div>
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
      </Paper>
    </div>
  );
}
