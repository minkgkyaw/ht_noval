/* eslint-disable react-hooks/exhaustive-deps */
import { Typography } from "@mui/material";
import { TableContainer } from "@mui/material";
import { TableHead } from "@mui/material";
import { TableCell, tableCellClasses } from "@mui/material";
import { TableBody } from "@mui/material";
import { styled } from "@mui/material";
import { TableRow } from "@mui/material";
import { Table } from "@mui/material";
import { Paper } from "@mui/material";
import { Box } from "@mui/material";
import moment from "moment";
import React from "react";
import { UserContext } from "../context/user.context";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Tooltip } from "@mui/material";
import { Zoom } from "@mui/material";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { CircularProgress } from "@mui/material";
import { IconButton } from "@mui/material";

const columns = [
  { id: "id", label: "No" },
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "role", label: "Role" },
  { id: "createdAt", label: "CreatedAt" },
  { id: "updatedAt", label: "UpdatedAt" },
];

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

const UsersList = () => {
  const router = useRouter();

  const {
    users,
    isLoading,
    isError,
    fetchAllUsers,
    resetFetchingAllUsersState,
    isDeleteUserError,
    isDeleteUserLoading,
    isDeleteUserSuccess,
    resetDeleteUserState,
    deleteUser,
  } = React.useContext(UserContext);

  React.useEffect(() => {
    const fetchingUsers = async () => {
      await fetchAllUsers();
    };
    fetchingUsers();
  }, []);

  React.useEffect(() => {
    const showAlert = () => {
      if (isError) {
        toast.error(isError.message);
        return setTimeout(() => resetFetchingAllUsersState(), 3000);
      } else if (isDeleteUserError) {
        toast.error(isDeleteUserError.message);
        return setTimeout(() => resetDeleteUserState(), 3000);
      } else if (isDeleteUserSuccess) {
        toast.success("Successfully deleted");
        return setTimeout(() => resetDeleteUserState(), 3000);
      }
      return;
    };
    showAlert();
  }, [isError]);

  return (
    <Paper sx={{ width: "100%", mt: 3 }}>
      <TableContainer component={Paper} elevation={1}>
        <Typography
          variant="h6"
          py={2}
          sx={{ mx: "auto", textAlign: "center" }}
        >
          All Users Lists
        </Typography>
        {isLoading && users?.length === 0 ? (
          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
            p={5}
            mx="auto"
          >
            <CircularProgress color="secondary" />
          </Box>
        ) : isError ? (
          <Box mx={"auto"} my={2}>
            <Typography
              color={"error"}
              variant="h6"
              sx={{ mx: "auto" }}
              align="center"
            >
              {isError && `${isError.message}`}
            </Typography>
          </Box>
        ) : (
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.id}>{col.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {users?.map((user, index) => {
                const createdAt = moment(user.createdAt).fromNow();
                return (
                  <StyledTableRow key={user.id} sx={{ cursor: "pointer" }}>
                    <Tooltip title="Click for more detail">
                      <StyledTableCell
                        component="th"
                        scope="row"
                        sx={{ cursor: "pointer" }}
                        onClick={() =>
                          router.push(`/admin/view/users/${user.id}`)
                        }
                      >
                        {index + 1}
                      </StyledTableCell>
                    </Tooltip>
                    <Tooltip title="Click for more detail">
                      <StyledTableCell
                        align="left"
                        sx={{ cursor: "pointer" }}
                        onClick={() =>
                          router.push(`/admin/view/users/${user.id}`)
                        }
                      >
                        {user.name}
                      </StyledTableCell>
                    </Tooltip>
                    <Tooltip title="Click for more detail">
                      <StyledTableCell
                        align="left"
                        sx={{ cursor: "pointer" }}
                        onClick={() =>
                          router.push(`/admin/view/users/${user.id}`)
                        }
                      >
                        {user.email}
                      </StyledTableCell>
                    </Tooltip>
                    <Tooltip title="Click for more detail">
                      <StyledTableCell
                        align="left"
                        sx={{ cursor: "pointer" }}
                        onClick={() =>
                          router.push(`/admin/view/users/${user.id}`)
                        }
                      >
                        {user.role}
                      </StyledTableCell>
                    </Tooltip>
                    <Tooltip
                      title={createdAt}
                      TransitionComponent={Zoom}
                      arrow
                      leaveDelay={100}
                      enterDelay={300}
                    >
                      <StyledTableCell
                        align="left"
                        sx={{ cursor: "pointer" }}
                        onClick={() =>
                          router.push(`/admin/view/users/${user.id}`)
                        }
                      >
                        {moment(user.createdAt).format("DD-MM-YYYY")}
                      </StyledTableCell>
                    </Tooltip>
                    <Tooltip title={moment(user.updatedAt).fromNow()} arrow>
                      <StyledTableCell align="left">
                        {moment(user.updated).format("DD-MM-YYYY")}
                      </StyledTableCell>
                    </Tooltip>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Paper>
  );
};

export default UsersList;
