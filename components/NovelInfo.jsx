import { List } from "@mui/material";
import { ListItemButton } from "@mui/material";
import { ListItemText } from "@mui/material";
import { ListItemIcon } from "@mui/material";
import { ListItem } from "@mui/material";
import { Typography } from "@mui/material";
import { Box } from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import MergeTypeIcon from "@mui/icons-material/MergeType";
import GTranslateIcon from "@mui/icons-material/GTranslate";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import { Tooltip } from "@mui/material";

const NovelInfo = () => {
  return (
    <Box sx={{ py: { xs: 3, sm: 1 }, minWidth: "35vw", display: "block" }}>
      <List>
        <Tooltip title="ဝတ္ထု အမည် - ကောင်းကင်ဘုံသို့ခြေဆန့်ခြင်း (လုအိုကျန်း)" arrow followCursor>
          <ListItem>
            <ListItemIcon sx={{ fontSize: { sm: 35, xs: 25 } }}>
              <AutoStoriesIcon color="secondary" fontSize="larger" />
            </ListItemIcon>
            <ListItemText
              sx={{ fontSize: { sm: 35, xs: 25, fontWeight: "600" } }}
              disableTypography
              primary="ကောင်းကင်ဘုံသို့ခြေဆန့်ခြင်း"
            />
          </ListItem>
        </Tooltip>
        <Tooltip title="အဓိကဇတ်ကောင် - လုအိုကျန်း" arrow followCursor>
          <ListItem>
            <ListItemIcon sx={{ fontSize: { sm: 35, xs: 25 } }}>
              <AccountBoxIcon color="secondary" fontSize="larger" />
            </ListItemIcon>
            <ListItemText
              sx={{ fontSize: { sm: 35, xs: 25, fontWeight: "600" } }}
              disableTypography
              primary="လုအိုကျန်း"
            />
          </ListItem>
        </Tooltip>
        <Tooltip title="အမျိုးအစား - ရသစုံ" arrow followCursor>
        <ListItem>
          <ListItemIcon sx={{ fontSize: { sm: 35, xs: 25 } }}>
            <MergeTypeIcon color="secondary" fontSize="larger" />
          </ListItemIcon>
          <ListItemText
            sx={{ fontSize: { sm: 35, xs: 25, fontWeight: "600" } }}
            disableTypography
            primary="ရသစုံ"
          />
        </ListItem>
        </Tooltip>
        <Tooltip title="ဘာသာပြန်သူ - ဟိန်းထက်" arrow followCursor>
        <ListItem>
          <ListItemIcon sx={{ fontSize: { sm: 35, xs: 25 } }}>
            <GTranslateIcon color="secondary" fontSize="larger" />
          </ListItemIcon>
          <ListItemText
            sx={{ fontSize: { sm: 35, xs: 25, fontWeight: "600" } }}
            disableTypography
            primary="ဟိန်းထက်"
          />
        </ListItem>
        </Tooltip>
        <Tooltip title="အရည်အသွေးသတ်မှတ်ချက် - ၄.၅/၅" arrow followCursor>
        <ListItem>
          <ListItemIcon sx={{ fontSize: { sm: 35, xs: 25 } }}>
            <StarIcon color="secondary" fontSize="larger" />
            <StarIcon color="secondary" fontSize="larger" />
            <StarIcon color="secondary" fontSize="larger" />
            <StarHalfIcon color="secondary" fontSize="larger" />
            <StarOutlineIcon color="secondary" fontSize="larger" />
          </ListItemIcon>
          <ListItemText
            sx={{ fontSize: { sm: 35, xs: 25, fontWeight: "600" }, pl: 2 }}
            disableTypography
            primary="4.5/5"
          />
        </ListItem>
        </Tooltip>
      </List>
    </Box>
  );
};

export default NovelInfo;
