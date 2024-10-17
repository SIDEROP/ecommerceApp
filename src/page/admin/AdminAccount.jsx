import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../store/slices/authSlice';
import './css/AdminAccount.css';
import Loder from '../../components/ui/Loder';

const AdminAccount = () => {
    const dispatch = useDispatch();

    const { user,loading } = useSelector((state) => state.auth?.reLogin);
    const { loading:udateLoain, error, success } = useSelector(
        (state) => state.auth.updateUser
    );

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [passwordAdmin, setPassword] = useState('');
    const [gender, setGender] = useState('');
    const [role, setRole] = useState('');
    const [img, setImg] = useState('');

    useEffect(() => {
        if (user) {
            setUsername(user?.username || '');
            setEmail(user?.email || '');
            setPassword('');
            setGender(user?.gender || '');
            setRole(user?.role || '');
            setImg(user?.img || '');
        }
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(
            updateUser({
                data: { username, email, passwordAdmin, gender, role },
            })
        );
    };

    
    if (loading) {
        return <Loder/>
    }

    return (
        <div className="AdminAccount">
            <h4>Admin Account</h4>

            <form onSubmit={handleSubmit}>
                {img && <img src={img} alt="Profile" />}
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <input
                    type="password"
                    value={passwordAdmin}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />

                <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>

                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    aria-readonly
                    disabled
                >
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>

                <button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update User'}
                </button>
            </form>
        </div>
    );
};

export default AdminAccount;
