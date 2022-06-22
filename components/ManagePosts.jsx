import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { IconButton } from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { TableFooter } from "@mui/material";
import { TableRow } from "@mui/material";
import { TablePagination } from "@mui/material";
import { TableBody } from "@mui/material";
import { Table } from "@mui/material";
import { TableHead } from "@mui/material";
import { Divider } from "@mui/material";
import { TableContainer } from "@mui/material";
import { Typography } from "@mui/material";
import { Paper } from "@mui/material";
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { CircularProgress } from "@mui/material";
import moment from "moment";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const ManagePosts = ({isLoading, isError, posts}) => {


  const [page, setPage] = React.useState(0);

  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ my: 4 }}>
      <Divider light />
      <TableContainer component={Paper} elevation={1}>
        <Typography
          variant="h6"
          py={2}
          sx={{ mx: "auto", textAlign: "center" }}
        >
          Posted chapters
        </Typography>
        {
          isLoading ? (<Box sx={{width: '100%', display: 'flex', justifyContent: 'center'}} p={5} mx="auto">
            <CircularProgress color="secondary" disableShrink />
          </Box>) : isError ? (<Box mx={'auto'} my={2}>
          <Typography color={'error'} variant="h6" sx={{mx: 'auto'}} align="center"> {isError.status = 404 ? 'စာစဥ် အပိုင်းများ မတင်ရသေးပါ။' : `${isError.status} - ${isError.data.message}`} </Typography>
          </Box>) : (<Table stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell>Chapters</StyledTableCell>
              <StyledTableCell align="center">Description</StyledTableCell>
              <StyledTableCell align="center">Created At</StyledTableCell>
              <StyledTableCell align="center">Edit</StyledTableCell>
              <StyledTableCell align="center">Delete</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? posts.posts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : posts.posts
            ).map((post) => {
              const createdAt = moment(post.createdAt).fromNow()
              return (
                <StyledTableRow key={post.chapters}>
                  <StyledTableCell component="th" scope="row">
                    {post.chapters}
                  </StyledTableCell>
                  <StyledTableCell align="left">{post.body.slice(0, 50)}...</StyledTableCell>
                  <StyledTableCell align="center">{createdAt}</StyledTableCell>
                  <StyledTableCell align="right">
                    <IconButton  color="info">
                      <ModeEditOutlineIcon fontSize="inherit"/>
                    </IconButton>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <IconButton  color="error">
                      <DeleteIcon />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              )
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={3}
                count={posts.posts.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>)
        }
      </TableContainer>
    </Box>
  );
};

export default ManagePosts;
