import {Link, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import React from "react";

const User = () => {

    const {id} = useParams();
    const [user, setUser] = React.useState<User>({
        user_id: 0,
        username: ""
    })
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const navigate = useNavigate();

    const deleteUser = (user: User) => {
        axios.delete('http://localhost:3000/api/users/' + user.user_id)
            .then((response) => {
                navigate('/users')
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    const editUser = (user: User) => {
        axios.put('http://localhost:3000/api/users/' + user.user_id,  {"username":
            user.username})
            .then((response) => {
                navigate('/users')
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }


    React.useEffect(() => {
        const getUser = () => {
            axios.get('http://localhost:3000/api/users/' + id)
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setUser(response.data)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }
        getUser()
    }, [id])
    if (errorFlag) {
        return (
            <div>
                <h1>User</h1>
                <div style={{color: "red"}}>
                    {errorMessage}
                </div>
                <Link to={"/users"}>Back to users</Link>
            </div>
        )
    } else {

        return (
            <div>
                <h1>User</h1>
                {user.user_id}: {user.username}
                <Link to={"/users"}>Back to users</Link>
                <button type="button" className="btn btn-primary" data-bs-toggle="modal"
                        data-bs-target="#editUserModal">
                    Edit
                </button>
                <div className="modal fade" id="editUserModal" tabIndex={-1}
                     role="dialog"
                     aria-labelledby="editUserModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="editUserModalLabel">Edit User</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputUsername1">Username</label>
                                        <input type="username" className="form-control" id="exampleInputUsername1"
                                               placeholder="Username" value={user.username} onChange={(event => setUser({user_id: user.user_id, username: event.target.value}))}></input>
                                    </div>
                                </form>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary"
                                        data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal"
                                        onClick={() => editUser(user)}> Edit User</button>
                            </div>
                        </div>
                    </div>
                </div>

                <button type="button" className="btn btn-primary" data-bs-toggle="modal"
                        data-bs-target="#deleteUserModal">
                    Deletedddddd
                </button>

            </div>
        )
    }


    return (<h1>User</h1>)
}
export default User;