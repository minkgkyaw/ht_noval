import { Box } from "@mui/material"
import { Typography } from "@mui/material"
import NewUser from "./NewUser"
import UsersList from "./UsersList"


const ManageAllUser = () => {
  return (
    <div className='manageAllUser'>
      <Typography variant="h4" mb={2} align="center">
          Manage All Users
        </Typography>
        <>
        <NewUser/>
        <UsersList/>
        </>
    </div>
  )
}

export default ManageAllUser