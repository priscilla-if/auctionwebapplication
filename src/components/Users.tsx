import axios from 'axios';
import React from "react";
import { Link } from 'react-router-dom';
import {useNavigate, useParams} from "react-router-dom";
import {
    Alert,
    AlertTitle,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper, Snackbar,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CSS from 'csstype';



// Users component
const Users = () => {
    const [users, setUsers] = React.useState<Array<User>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const navigate = useNavigate();

    // Custom card CSS styling
    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
    }

    // Tells us what datatype the table displays. Relevant for features such as sorting.
    interface HeadCell {
        id: string;
        label: string;
        numeric: boolean;
    }
    const headCells: readonly HeadCell[] = [
        { id: 'ID', label: 'id', numeric: true },
        { id: 'username', label: 'Username', numeric: false },
        { id: 'link', label: 'Link', numeric: false },
        { id: 'actions', label: 'Actions', numeric: false }
    ];

    // Upon rendering, getUsers will be called
    React.useEffect(() => {
        getUsers()
    }, [])

    // Gets all the users from the database request
    const getUsers = () => {
        axios.get('http://localhost:3000/api/users')
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setUsers(response.data)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    // delete user function/request
    const deleteUser = (user:User) => {
        axios.delete('http://localhost:3000/api/users/' + user.user_id)
            .then((response) => {
                getUsers();
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })

    }

    // user rows, list of users and table
    const user_rows = () => {
        return users.map((row: User) =>
            <TableRow hover
                      tabIndex={-1}
                      key={row.user_id}>
                <TableCell>
                    {row.user_id}
                </TableCell>
                <TableCell align="right">{row.username}</TableCell>
                <TableCell align="right"><Link
                    to={"/users/"+row.user_id}>Go to user</Link></TableCell>
                <TableCell align="right">
                    <Button variant="outlined" endIcon={<EditIcon/>}
                            onClick={() => {handleEditDialogOpen(row)}}>
                        Edit
                    </Button>
                    <Button variant="outlined" endIcon={<DeleteIcon/>}
                            onClick={() => {handleDeleteDialogOpen(row)}}>
                        Delete
                    </Button>
                </TableCell>
            </TableRow>
        )
    }

    // Add user functionality
    const [username, setUsername] =
    React.useState("")
    const updateUsernameState = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setUsername(event.target.value)
    }
    const addUser = () => {
        axios.post('http://localhost:3000/api/users/',  {"username":
            username})
            .then((response) => {
                getUsers();
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    // Open Delete dialog state and handlers for opening and closing
    const [openDeleteDialog, setOpenDeleteDialog] =
        React.useState(false)
    const [dialogUser, setDialogUser] =
        React.useState<User>({username:"", user_id:-1})
    const handleDeleteDialogOpen = (user:User) => {
        setDialogUser(user)
        setOpenDeleteDialog(true);
    };
    const handleDeleteDialogClose = () => {
        setDialogUser({username:"", user_id:-1})
        setOpenDeleteDialog(false);
    };

    // Open Edit Dialog state and handlers
    const [openEditDialog, setOpenEditDialog] =
        React.useState(false)
    const handleEditDialogOpen = (user:User) => {
        setDialogUser(user)
        setOpenEditDialog(true);
    };
    const handleEditDialogClose = () => {
        setDialogUser({username:"", user_id:-1})
        setOpenEditDialog(false);
    };


    // Edit user request
    const editUser = (user: User) => {
        axios.put('http://localhost:3000/api/users/' + user.user_id,  {"username":
            usernameEdit})
            .then((response) => {
                setOpenEditDialog(false)
                getUsers();
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
        // Shows snack for editing username - will show on the bottom left by default but this can be changed easily
        setSnackMessage("Username changed successfully")
        setSnackOpen(true)

    }

    // Edited username state and onChange handler
    const [usernameEdit, setUsernameEdit] =
    React.useState("Username");

    const updateUsernameEditState = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setUsernameEdit(event.target.value)
    }

    // Snackbar state and handlers
    const [snackOpen, setSnackOpen] = React.useState(false)
    const [snackMessage, setSnackMessage] = React.useState("")
    const handleSnackClose = (event?: React.SyntheticEvent | Event,
                              reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen(false);
    };



        return (
            <div>
                {errorFlag && <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                </Alert>}
                <h1>Users</h1>
                <Paper elevation={3} style={card}>
                    <h1>Add a new user</h1>
                    <Stack direction="row" spacing={2} justifyContent="center">
                        <TextField id="outlined-basic" label="Username"
                                   variant="outlined" value={username} onChange={updateUsernameState}
                        />
                        <Button variant="outlined" onClick={() => {addUser()}}>
                            Submit
                        </Button>
                    </Stack>
                </Paper>
                <Paper elevation={3} style={card}>
                    <h1></h1>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {headCells.map((headCell) => (
                                        <TableCell
                                            key={headCell.id}
                                            align={headCell.numeric ? 'right' :
                                                'left'}
                                            padding={'normal'}>
                                            {headCell.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {user_rows()}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                <Dialog
                    open={openDeleteDialog}
                    onClose={handleDeleteDialogClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">
                        {"Delete User?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this user?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteDialogClose}>Cancel</Button>
                        <Button variant="outlined" color="error" onClick={() =>
                        {deleteUser(dialogUser)}} autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={openEditDialog}
                    onClose={handleEditDialogClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">
                        {"Edit User?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to edit this user?
                            <TextField id="outlined-basic" label={usernameEdit} variant="outlined"
                                       value={usernameEdit} onChange={updateUsernameEditState} />
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEditDialogClose}>Cancel</Button>
                        <Button variant="outlined" color="error" onClick={() =>
                        {editUser(dialogUser)}} autoFocus>
                            Edit
                        </Button>
                    </DialogActions>
                </Dialog>
                <Snackbar
                    autoHideDuration={6000}
                    open={snackOpen}
                    onClose={handleSnackClose}
                    key={snackMessage}
                >
                    <Alert onClose={handleSnackClose} severity="success" sx={{
                        width: '100%' }}>
                        {snackMessage}
                    </Alert>
                </Snackbar>



            </div>
        )
                    }
export default Users;