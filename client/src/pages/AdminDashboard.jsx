import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

// MUI Components
import {
  Box, Drawer, AppBar, Toolbar, Typography, IconButton,
  List, ListItem, ListItemIcon, ListItemText, Grid,
  Paper, Button, Menu, MenuItem, Divider
} from '@mui/material';

// MUI Icons
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Article as ArticleIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function AdminDashboard() {
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [metrics, setMetrics] = useState({
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    viewsByDay: [],
    postsByCategory: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [widgets, setWidgets] = useState([
    { id: 'stats', title: 'Quick Stats' },
    { id: 'views', title: 'Views Over Time' },
    { id: 'categories', title: 'Posts by Category' },
    { id: 'recent', title: 'Recent Activity' }
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [postsRes, metricsRes] = await Promise.all([
        axios.get('/api/posts'),
        axios.get('/api/metrics') // You'll need to create this endpoint
      ]);

      setPosts(postsRes.data.posts);
      setMetrics(metricsRes.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWidgets(items);
  };

  const renderWidget = (widget) => {
    switch (widget.id) {
      case 'stats':
        return (
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4">Quick Stats</Typography>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <div className="text-center">
                  <Typography variant="h4">{metrics.totalViews}</Typography>
                  <Typography variant="body2" color="textSecondary">Total Views</Typography>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="text-center">
                  <Typography variant="h4">{metrics.totalLikes}</Typography>
                  <Typography variant="body2" color="textSecondary">Total Likes</Typography>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="text-center">
                  <Typography variant="h4">{metrics.totalComments}</Typography>
                  <Typography variant="body2" color="textSecondary">Comments</Typography>
                </div>
              </Grid>
            </Grid>
          </Paper>
        );

      case 'views':
        return (
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4">Views Over Time</Typography>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.viewsByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        );

      case 'categories':
        return (
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4">Posts by Category</Typography>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.postsByCategory}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {metrics.postsByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        );

      case 'recent':
        return (
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4">Recent Posts</Typography>
            <div className="space-y-4">
              {posts.slice(0, 5).map((post) => (
                <div key={post._id} className="flex justify-between items-center">
                  <div>
                    <Typography variant="subtitle2">{post.title}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </Typography>
                  </div>
                  <Link
                    to={`/admin/edit/${post._id}`}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          </Paper>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="lg:ml-64 transition-all duration-300">
      <Box sx={{ display: 'flex' }}>
        {/* Drawer */}
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
            },
          }}
        >
          <List>
            <ListItem button>
              <ListItemIcon><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={Link} to="/admin/new-post">
              <ListItemIcon><ArticleIcon /></ListItemIcon>
              <ListItemText primary="Posts" />
            </ListItem>
            <ListItem button>
              <ListItemIcon><PeopleIcon /></ListItemIcon>
              <ListItemText primary="Users" />
            </ListItem>
            <ListItem button>
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
        </Drawer>

        {/* Main content */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <AppBar position="static" color="default" elevation={0}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setDrawerOpen(true)}
                sx={{ mr: 2, display: { sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Dashboard
              </Typography>
              <Button
                component={Link}
                to="/admin/new-post"
                startIcon={<AddIcon />}
                variant="contained"
                color="primary"
              >
                New Post
              </Button>
            </Toolbar>
          </AppBar>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="widgets">
              {(provided) => (
                <Grid
                  container
                  spacing={3}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="mt-4"
                >
                  {widgets.map((widget, index) => (
                    <Draggable key={widget.id} draggableId={widget.id} index={index}>
                      {(provided) => (
                        <Grid
                          item
                          xs={12}
                          md={widget.id === 'stats' ? 12 : 6}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {renderWidget(widget)}
                        </Grid>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Grid>
              )}
            </Droppable>
          </DragDropContext>
        </Box>
      </Box>
    </div>
  );
}

export default AdminDashboard; 