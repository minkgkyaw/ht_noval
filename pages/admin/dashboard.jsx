import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PostAddIcon from "@mui/icons-material/PostAdd";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import PersonIcon from "@mui/icons-material/Person";
import NewPost from "../../components/NewPost";
import ManagePosts from "../../components/ListPosts";
import { useGetPosts } from "../../hook/useFetchPosts";
import ManageAllPosts from "../../components/ManageAllPosts";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            justifyItems: "center",
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function Dashboard() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        display: "flex",
        height: "full",
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        <Tab
          sx={{ my: 1 }}
          icon={<PostAddIcon />}
          iconPosition="start"
          label="Manage Posts"
          {...a11yProps(0)}
        />
        <Tab
          sx={{ my: 1 }}
          icon={<MenuBookIcon />}
          iconPosition="start"
          label="Manage E-books"
          {...a11yProps(1)}
        />
        <Tab
          sx={{ my: 1 }}
          icon={<SupervisedUserCircleIcon />}
          iconPosition="start"
          label="Manage Users"
          {...a11yProps(2)}
        />
        <Tab
          sx={{ my: 1 }}
          icon={<PersonIcon />}
          iconPosition="start"
          label="Your Profile"
          {...a11yProps(3)}
        />
      </Tabs>
      <TabPanel value={value} index={0} style={{ width: "62vw" }}>
        <ManageAllPosts />
      </TabPanel>
      <TabPanel value={value} index={1} style={{ width: "62vw" }}>
        <Typography variant="h4" align="center" color={"primary"}>
          Manage All E-Books
        </Typography>
      </TabPanel>
      <TabPanel value={value} index={2} style={{ width: "62vw" }}>
        <Typography variant="h4" align="center" color={"primary"}>
          Manage All Users
        </Typography>
      </TabPanel>
      <TabPanel value={value} index={3} style={{ width: "62vw" }}>
        <Typography variant="h4" align="center" color={"primary"}>
          Your Profile
        </Typography>
      </TabPanel>
    </Box>
  );
}
