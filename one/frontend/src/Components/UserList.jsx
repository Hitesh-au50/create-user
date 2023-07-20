import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', age: '' });

  useEffect(() => {
    fetchUsers();
  }, []);


  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/users');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      fetchUsers(); // Refresh the user list after adding a new user
      setNewUser({ name: '', email: '', age: '' }); // Clear the form inputs
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      fetchUsers(); // Refresh the user list after successful deletion
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };



  return (
    <div className="container">
      <div className="row">
        {/* Left Column (Form) */}
        <div className="col-md-4">
          <form onSubmit={handleSubmit}>
            <h1 className="my-4">Add User</h1>
            <input
              type="text"
              name="name"
              value={newUser.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="form-control mb-2"
            />
            <input
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="form-control mb-2"
            />
            <input
              type="number"
              name="age"
              value={newUser.age}
              onChange={handleInputChange}
              placeholder="Age"
              className="form-control mb-2"
            />
            <button type="submit" className="btn btn-primary">Create User</button>
          </form>
        </div>

        {/* Right Column (Table) */}
        <div className="col-md-8">
          <h1 className="my-4">User List</h1>
          <div style={{ height: '400px', overflowY: 'scroll' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.age}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
