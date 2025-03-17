import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { listSlumsoccerNews, getSlumsoccerNews } from "../../graphql/queries";
import { deleteSlumsoccerNews } from "../../graphql/mutations";
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
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import { generateClient } from "aws-amplify/api";

const client = generateClient();

export function News() {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterNewspaper, setFilterNewspaper] = useState(null);
  const [newspapers, setNewspapers] = useState([]);

  // Fetch news on component mount
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const newsData = await client.graphql({
        query: listSlumsoccerNews,
        variables: { limit: 100 }
      });
      
      const items = newsData.data.listSlumsoccerNews.items;
      setNewsItems(items);
      
      // Extract unique newspapers for filtering
      const uniqueNewspapers = [...new Set(items.map(news => news.newspaper))].filter(Boolean);
      setNewspapers(uniqueNewspapers);
      
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Failed to load news. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (news) => {
    setSelectedNews(news);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await client.graphql({
        query: deleteSlumsoccerNews,
        variables: {
          input: {
            newsId: selectedNews.newsId
          }
        }
      });
      
      // Remove deleted news from state
      setNewsItems(newsItems.filter(n => n.newsId !== selectedNews.newsId));
      setNotification({
        open: true,
        message: "News item deleted successfully!",
        severity: "success"
      });
    } catch (err) {
      console.error("Error deleting news:", err);
      setNotification({
        open: true,
        message: "Failed to delete news item. Please try again.",
        severity: "error"
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedNews(null);
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

  const handleFilterSelect = (newspaper) => {
    setFilterNewspaper(newspaper);
    setAnchorEl(null);
  };

  const clearFilter = () => {
    setFilterNewspaper(null);
    setAnchorEl(null);
  };

  // Filter and search news
  const filteredNews = newsItems
    .filter(news => !filterNewspaper || news.newspaper === filterNewspaper)
    .filter(news => 
      searchTerm === "" || 
      news.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      news.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.newspaper?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-2xl font-bold mb-4 md:mb-0">News</h1>
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="text-gray-400" />
            </div>
            <TextField
              placeholder="Search news..."
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
              {filterNewspaper || "Filter by newspaper"}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleFilterMenuClose}
            >
              {newspapers.map((newspaper) => (
                <MenuItem key={newspaper} onClick={() => handleFilterSelect(newspaper)}>
                  {newspaper}
                </MenuItem>
              ))}
              {filterNewspaper && (
                <MenuItem onClick={clearFilter}>
                  <span className="text-red-500">Clear Filter</span>
                </MenuItem>
              )}
            </Menu>
          </div>
          
          {/* Add new news item button */}
          <Link to="/news/new">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              style={{ textTransform: 'none', borderRadius: '8px' }}
            >
              Add News Item
            </Button>
          </Link>
        </div>
      </div>

      {/* News list */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {filteredNews.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Newspaper</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNews.map((news) => (
                  <tr key={news.newsId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {news.imgUrl ? (
                          <div className="h-10 w-10 rounded-md overflow-hidden mr-3">
                            <img 
                              src={news.imgUrl} 
                              alt={news.title} 
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/40?text=News";
                              }}
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-gray-200 mr-3 flex items-center justify-center text-gray-500">
                            <NewspaperIcon fontSize="small" />
                          </div>
                        )}
                        <div className="font-medium text-gray-900">{news.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {news.newspaper || "Not specified"}
                      </span>
                    </td>                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {news.description || "No description available"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {news.link ? (
                        <a 
                          href={news.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Read article
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">No link</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Tooltip title="Edit">
                          <Link to={`/news/edit/${news.newsId}`}>
                            <IconButton size="small" color="primary">
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Link>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => handleDeleteClick(news)}
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
            <p className="text-gray-500">No news items found</p>
            {searchTerm || filterNewspaper ? (
              <p className="text-sm text-gray-400 mt-2">
                Try adjusting your search or filter criteria
              </p>
            ) : (
              <Link to="/news/new">
                <Button 
                  variant="outlined" 
                  color="primary" 
                  startIcon={<AddIcon />}
                  style={{ marginTop: '16px', textTransform: 'none' }}
                >
                  Add your first news item
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
        <DialogTitle>Delete News Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{selectedNews?.title}"? This action cannot be undone.
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