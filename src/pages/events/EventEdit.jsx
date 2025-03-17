import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSlumsoccerEvents } from "../../graphql/queries";
import {
  createSlumsoccerEvents,
  updateSlumsoccerEvents,
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
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Snackbar,
  Menu,
} from "@mui/material";
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
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import BorderHorizontalIcon from "@mui/icons-material/BorderHorizontal";
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
import TableChartIcon from "@mui/icons-material/TableChart";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { generateClient } from "aws-amplify/api";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { uploadData } from "aws-amplify/storage";
import { mergeAttributes } from "@tiptap/core";
import Heading from "@tiptap/extension-heading";
import Underline from "@tiptap/extension-underline";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import HardBreak from "@tiptap/extension-hard-break";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import '../tablestyle.css'


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

const formatDate = (isoString) => {
  const options = { month: "short", day: "2-digit", year: "numeric" };
  return new Date(isoString).toLocaleDateString("en-US", options);
};

export default function EventEdit() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  // const isNewEvent = eventId === "new";
  const isNewEvent = window.location.pathname.includes('/events/new');

  const [event, setEvent] = useState({
    eventId: "",
    title: "",
    description: "",
    imgUrl: "",
    mainContent: { html: "" },
    date: new Date().toISOString().split("T")[0],
  });

  const [loading, setLoading] = useState(!isNewEvent);
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
  const [tableMenuAnchorEl, setTableMenuAnchorEl] = useState(null);

  const editorCSS = {
    h1: "block text-[2em] mt-[0.67em] mb-[0.67em] mx-0 font-bold [unicode-bidi:isolate]",
    h2: "block text-[1.5em] mt-[0.83em] mb-[0.83em] mx-0 font-bold [unicode-bidi:isolate]",
    h3: "block text-[1.17em] mt-[1em] mb-[1em] mx-0 font-bold [unicode-bidi:isolate]",
    blockquote: "block mt-[1em] mb-[1em] mx-[40px] [unicode-bidi:isolate]",
    ul: "block list-disc mt-[1em] mb-[1em] mx-0 pl-[40px] [unicode-bidi:isolate]",
    ol: "block list-decimal mt-[1em] mb-[1em] mx-0 pl-[40px] [unicode-bidi:isolate]",
    li: "list-item text-left [unicode-bidi:isolate]",
    p: "block mt-[1em] mb-[1em] mx-0 [unicode-bidi:isolate]",
    a: "text-[blue] cursor-pointer underline",
    u: "underline",
    table:
      "table border-collapse border border-[gray] border-spacing-[2px] overflow-hidden w-full m-0 table-fixed [unicode-bidi:isolate]",
    tableCell:
      "table-cell border border-gray-300 p-2 box-border min-w-[1em] px-[8px] py-[6px] relative align-top ",
    tableHeader:
      "table-cell border border-gray-300 bg-gray-100 box-border p-2 font-bold text-left min-w-[1em] px-[8px] py-[6px] relative align-top",
    hr: "border-none h-[2px] bg-gray-300 my-4",
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

  //for storing the editor content without causing re-renders
  const editorContentRef = useRef("");

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: editorCSS.ul,
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: editorCSS.ol,
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: editorCSS.blockquote,
          },
        },
        listItem: {
          HTMLAttributes: {
            class: editorCSS.li,
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: editorCSS.p,
          },
        },
        horizontalRule: {
          HTMLAttributes: {
            class: editorCSS.hr,
          },
        },
      }),
      CustomHeading,
      Underline.configure({
        HTMLAttributes: {
          class: editorCSS.u,
        },
      }),
      Placeholder.configure({
        placeholder: "Write your content here...",
      }),
      Image.configure({
        inline: true,
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: editorCSS.table,
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: editorCSS.tableHeader,
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: editorCSS.tableCell,
        },
      }),
      HardBreak,
    ],
    content: event.mainContent
      ? typeof event.mainContent === "string" && event.mainContent.trim() !== ""
        ? JSON.parse(event.mainContent).html
        : ""
      : "",
    onUpdate: ({ editor }) => {
      editorContentRef.current = editor.getHTML();
    },
  });

  useEffect(() => {
    if (!isNewEvent) {
      fetchEvent();
    } else {
      setEvent({
        eventId: uuidv4(),
        title: "",
        description: "",
        imgUrl: "",
        mainContent: { html: "" },
        date: new Date().toISOString().split("T")[0],
      });
    }
  }, [eventId]);

  // Update editor content when event data changes
  useEffect(() => {
    if (editor && event.mainContent) {
      try {
        const contentObj = JSON.parse(JSON.parse(event.mainContent));
        if (contentObj && contentObj.html) {
          editor.commands.setContent(contentObj.html);
        }
      } catch (err) {
        // Handle case where mainContent might not be in JSON format yet
        console.warn("Error parsing mainContent:", err);
        editor.commands.setContent(event.mainContent.html);
      }
    }
  }, [editor, event.mainContent]);

  // Set image preview when imgUrl changes
  useEffect(() => {
    if (event.imgUrl) {
      setImagePreview(event.imgUrl);
    }
  }, [event.imgUrl]);

  const fetchEvent = async () => {
    try {

      if (isNewEvent) {
        return;
      }

      setLoading(true);
      const response = await client.graphql({
        query: getSlumsoccerEvents,
        variables: { eventId: eventId },
      });

      const eventData = response.data.getSlumsoccerEvents;
      if (eventData) {
        // Format date to YYYY-MM-DD for date input if it exists
        if (eventData.date) {
          eventData.date = new Date(eventData.date).toISOString().split("T")[0];
        }
        setEvent(eventData);
      } else {
        setError("Event not found");
      }
    } catch (err) {
      console.error("Error fetching event:", err);
      setError("Failed to load event. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvent((prev) => ({ ...prev, [name]: value }));
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

  const handleEditorChange = () => {
    setEvent((prev) => ({
      ...prev,
      mainContent: JSON.stringify(
        JSON.stringify({ html: editorContentRef.current })
      ),
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Validate required fields
      if (!event.title) {
        setNotification({
          open: true,
          message: "Event title is required",
          severity: "error",
        });
        return;
      }

      // Upload image to S3 if a new file is selected
      let finalImgUrl = event.imgUrl;
      if (imageFile) {
        const uploadedUrl = await uploadImageToS3(imageFile);
        if (uploadedUrl) {
          finalImgUrl = uploadedUrl;
        } else {
          // If upload failed, keep using the existing URL or empty string
          finalImgUrl = event.imgUrl || "";
        }
      }

      // Format date to ISO string for saving
      const formattedDate = event.date ? new Date(event.date).toISOString() : new Date().toISOString();

      const input = {
        eventId: event.eventId,
        title: event.title,
        description: event.description || "",
        imgUrl: finalImgUrl || "",
        mainContent:
          typeof event.mainContent === "string"
            ? event.mainContent
            : JSON.stringify(JSON.stringify({ html: event.mainContent || "" })),
        date: formattedDate || new Date().toISOString().split('T')[0],
      };

      if (isNewEvent) {
        await client.graphql({
          query: createSlumsoccerEvents,
          variables: { input },
        });
        setNotification({
          open: true,
          message: "Event created successfully!",
          severity: "success",
        });
      } else {
        await client.graphql({
          query: updateSlumsoccerEvents,
          variables: { input },
        });
        setNotification({
          open: true,
          message: "Event updated successfully!",
          severity: "success",
        });
    }

    // Redirect after short delay
    setTimeout(() => {
      navigate("/events");
    }, 1500);
  } catch (err) {
    console.error("Error saving event:", err);
    setNotification({
      open: true,
      message: `Failed to ${
        isNewEvent ? "create" : "update"
      } event. Please try again.`,
      severity: "error",
    });
  } finally {
    setSaving(false);
  }
};

const handleRemoveImage = () => {
  setImageFile(null);
  setImagePreview("");
  setEvent((prev) => ({ ...prev, imgUrl: "" }));
};

const handleCloseNotification = () => {
  setNotification({ ...notification, open: false });
};

// Editor toolbar handlers
const addLink = () => {
  const url = window.prompt("URL");
  if (url) {
    editor.chain().focus().setLink({ href: url, class: editorCSS.a }).run();
  }
};

const addImage = () => {
  const url = window.prompt("Image URL");
  if (url) {
    editor.chain().focus().setImage({ src: url }).run();
  }
};

// Table menu handlers
const handleTableMenuOpen = (event) => {
  setTableMenuAnchorEl(event.currentTarget);
};

const handleTableMenuClose = () => {
  setTableMenuAnchorEl(null);
};

const insertTable = () => {
  editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run();
  handleTableMenuClose();
};

const addColumnBefore = () => {
  editor.chain().focus().addColumnBefore().run();
  handleTableMenuClose();
};

const addColumnAfter = () => {
  editor.chain().focus().addColumnAfter().run();
  handleTableMenuClose();
};

const deleteColumn = () => {
  editor.chain().focus().deleteColumn().run();
  handleTableMenuClose();
};

const addRowBefore = () => {
  editor.chain().focus().addRowBefore().run();
  handleTableMenuClose();
};

const addRowAfter = () => {
  editor.chain().focus().addRowAfter().run();
  handleTableMenuClose();
};

const deleteRow = () => {
  editor.chain().focus().deleteRow().run();
  handleTableMenuClose();
};

const deleteTable = () => {
  editor.chain().focus().deleteTable().run();
  handleTableMenuClose();
};

const toggleHeaderCell = () => {
  editor.chain().focus().toggleHeaderCell().run();
  handleTableMenuClose();
};

const mergeCells = () => {
  editor.chain().focus().mergeCells().run();
  handleTableMenuClose();
};

const splitCell = () => {
  editor.chain().focus().splitCell().run();
  handleTableMenuClose();
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
        onClick={() => navigate("/events")}
        style={{ marginTop: "16px" }}
      >
        Back to Events
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
          onClick={() => navigate("/events")}
          style={{ marginRight: "16px" }}
        >
          Back
        </Button>
        <h1 className="text-2xl font-bold">
          {isNewEvent ? "Create New Event" : "Edit Event"}
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
          {saving ? "Saving..." : "Save Event"}
        </Button>
      </div>
    </div>

    <Paper className="p-6">
      <Grid container spacing={3}>
        {/* Basic Event Info */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Event Title *"
            name="title"
            value={event.title}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Event Date"
            name="date"
            type="date"
            value={event.date}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            helperText="Set the date for this event"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description"
            name="description"
            value={event.description}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
            multiline
            rows={2}
            helperText="Brief description of the event"
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
                  alt="Event preview"
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
        <h2 className="text-lg font-semibold mb-3">Event Content</h2>

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
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor?.isActive("underline")}
            disabled={!editor}
            title="Underline"
          >
            <UnderlineIcon fontSize="small" />
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
            <FormatListBulletedIcon />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor?.isActive("orderedList")}
            disabled={!editor}
            title="Numbered List"
          >
            <FormatListNumberedIcon />
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

          <IconButton
            size="small"
            className="m-1"
            onClick={handleTableMenuOpen}
            color={editor?.isActive("table") ? "primary" : "default"}
            disabled={!editor}
            aria-controls="table-menu"
            aria-haspopup="true"
          >
            <TableChartIcon fontSize="small" />
            <ArrowDropDownIcon fontSize="small" />
          </IconButton>
          <Menu
            id="table-menu"
            anchorEl={tableMenuAnchorEl}
            open={Boolean(tableMenuAnchorEl)}
            onClose={handleTableMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <MenuItem onClick={insertTable}>Insert Table</MenuItem>
            <Divider />
            <MenuItem
              onClick={addColumnBefore}
              disabled={!editor?.isActive("table")}
            >
              Add Column Before
            </MenuItem>
            <MenuItem
              onClick={addColumnAfter}
              disabled={!editor?.isActive("table")}
            >
              Add Column After
            </MenuItem>
            <MenuItem
              onClick={deleteColumn}
              disabled={!editor?.isActive("table")}
            >
              Delete Column
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={addRowBefore}
              disabled={!editor?.isActive("table")}
            >
              Add Row Before
            </MenuItem>
            <MenuItem
              onClick={addRowAfter}
              disabled={!editor?.isActive("table")}
            >
              Add Row After
            </MenuItem>
            <MenuItem
              onClick={deleteRow}
              disabled={!editor?.isActive("table")}
            >
              Delete Row
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={toggleHeaderCell}
              disabled={!editor?.isActive("table")}
            >
              Toggle Header Cell
            </MenuItem>
            <MenuItem
              onClick={mergeCells}
              disabled={!editor?.isActive("table")}
            >
              Merge Cells
            </MenuItem>
            <MenuItem
              onClick={splitCell}
              disabled={!editor?.isActive("table")}
            >
              Split Cell
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={deleteTable}
              disabled={!editor?.isActive("table")}
            >
              Delete Table
            </MenuItem>
          </Menu>

          {/* Hard Break and Horizontal Rule */}
          <MenuButton
            onClick={() => editor.chain().focus().setHardBreak().run()}
            disabled={!editor}
            title="Hard Break (Line Break)"
          >
            <KeyboardReturnIcon fontSize="small" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            disabled={!editor}
            title="Horizontal Rule"
          >
            <BorderHorizontalIcon fontSize="small" />
          </MenuButton>
          <Divider
            orientation="vertical"
            flexItem
            style={{ margin: "0 8px" }}
          />
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
          <Divider
            orientation="vertical"
            flexItem
            style={{ margin: "0 8px" }}
          />
          <Tooltip title="Save">
            <Button
              onClick={handleEditorChange}
              size="small"
              variant="contained"
              sx={{
                fontWeight: "bold",
                backgroundColor: "black",
                marginLeft: "auto",
              }}
            >
              Save
            </Button>
          </Tooltip>
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