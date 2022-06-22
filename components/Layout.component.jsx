import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Container, MenuItem, Tooltip, Avatar, Menu } from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import useLogin from "../hook/useLogin";
import useGetUserInfo from "../hook/useGetUserInfo";

const drawerWidth = 220;
const navItems = ["Home", "E-books", "About"];
const settings = ["Account", "Dashboard"];

const Layout = (props) => {
  const router = useRouter();

  const { logout, token } = useLogin();

  const { window } = props;

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [isAuthUser, setIsAuthUser] = React.useState(false);

  React.useEffect(() => {
    if (!token) return setIsAuthUser(false);
    return setIsAuthUser(true);
  }, [token]);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (page) => {
    return setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleRoute = (item) => {
    const page = item.toLowerCase();
    if (page === "home") return router.push("/");
    return router.push(`${page}`);
  };

  const logoutHandler = () => logout();

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Hein Htet Novel
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton
              sx={{ textAlign: "center" }}
              onClick={() => handleRoute(item)}
            >
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const adminMiniMenu = (
    <Box sx={{ flexGrow: 0, display: { xs: "none", lg: "flex" } }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt="Remy Sharp" src="/images/avatar.svg" />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settings.map((setting) => (
          <MenuItem key={setting} onClick={handleCloseUserMenu}>
            <Link href={`/admin/${setting.toLowerCase()}`} passHref>
              <Typography textAlign="center">{setting}</Typography>
            </Link>
          </MenuItem>
        ))}
        <MenuItem onClick={logoutHandler}>
          <Typography>Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { sm: "none", xs: "flex" },
              cursor: "pointer",
            }}
          >
            <MenuIcon />
          </IconButton>
          {/* for large screen  */}
          <Link href={"/"} passHref>
            <Typography
              variant="h6"
              component="a"
              sx={{
                display: { xs: "none", sm: "block" },
                mr: 10,
                cursor: "pointer",
              }}
            >
              Hein Htet Novel
            </Typography>
          </Link>
          <Box sx={{ display: { xs: "none", sm: "flex" }, flexGrow: 1 }}>
            {navItems.map((item) => (
              <Tooltip title={`Go to ${item}`} key={item}>
                <Button
                  sx={{ color: "#fff", mx: 1 }}
                  onClick={() => handleRoute(item)}
                >
                  {item}
                </Button>
              </Tooltip>
            ))}
          </Box>
          {/* for admin account control/ setting */}
          {isAuthUser ? adminMiniMenu : null}
        </Toolbar>
      </AppBar>
      {/* for mobile screen */}
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      {/* for main section */}
      <Container component={'main'} maxWidth="lg" sx={{py: {xs:3, sm: 5}}}>
        <Toolbar />
        {props.children}
      </Container>
    </Box>
  );
};

Layout.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default Layout;
