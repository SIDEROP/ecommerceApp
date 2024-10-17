import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../store/slices/authSlice';
import { createOrUpdateAddress } from '../../store/slices/addressSlice'; // Import the combined action
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/ui/Loder';

const Account = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        isAuthenticated,
        user,
        loading: load,
    } = useSelector((state) => state.auth.reLogin);
    const { loading, error } = useSelector((state) => state.auth.updateUser);
    const { addresses, loading: addressLoading } = useSelector(
        (state) => state.address
    );

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [passwordAdmin, setPassword] = useState('');
    const [gender, setGender] = useState('');
    const [role, setRole] = useState('');
    const [img, setImg] = useState('');
    const [addressId, setAddressId] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
    const [contacts, setContacts] = useState('+91'); // Initialize with +91
    const [apartmentNumber, setApartmentNumber] = useState('');
    const [landmark, setLandmark] = useState('');

    // State for toggling sections
    const [isProfileOpen, setIsProfileOpen] = useState(true);
    const [isAddressOpen, setIsAddressOpen] = useState(false);
    
    // Country code options
    const contactOptions = [
        { name: 'India', code: '+91' },
        { name: 'United States', code: '+1' },
        { name: 'United Kingdom', code: '+44' },
        { name: 'Australia', code: '+61' },
        { name: 'Canada', code: '+1' },
        { name: 'Germany', code: '+49' },
        { name: 'France', code: '+33' },
        { name: 'Japan', code: '+81' },
        { name: 'China', code: '+86' },
        { name: 'South Africa', code: '+27' },
        // Add more countries as needed
    ];

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'user') {
            navigate('ecommerceApp/auth', { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        if (user) {
            setUsername(user?.username || '');
            setEmail(user?.email || '');
            setPassword(''); // Reset password on user load
            setGender(user?.gender || '');
            setRole(user?.role || '');
            setImg(user?.img || '');
        }
    }, [user]);

    useEffect(() => {
        if (user?.address) {
            const address = user?.address;
            setAddressId(address?._id);
            setStreet(address?.street);
            setCity(address?.city);
            setState(address?.state);
            setPostalCode(address?.postalCode);
            setCountry(address?.country);
            setContacts(address?.contacts);
            setApartmentNumber(address?.apartmentNumber || '');
            setLandmark(address?.landmark || '');
        }
    }, [user]);

    const handleUserSubmit = (e) => {
        e.preventDefault();
        dispatch(
            updateUser({
                data: { username, email, passwordAdmin, gender, role },
            })
        );
    };

    const handleAddressSubmit = (e) => {
        e.preventDefault();

        // Ensure the contacts state starts with the selected contact code
        if (!contacts.startsWith('+')) {
            return; // or set an error state to notify the user
        }

        // Dispatch createOrUpdateAddress with the relevant address data
        dispatch(
            createOrUpdateAddress({
                addressId, // Include the addressId to determine if this is an update
                street,
                city,
                state,
                postalCode,
                country,
                contacts,
                apartmentNumber,
                landmark,
            })
        );
    };

    if (load) {
        return <Loader />;
    }

    return (
        <div className="AdminAccount">
            {/* Toggle buttons */}
            <div className="toggle-buttons">
                <button
                    onClick={() => {
                        setIsProfileOpen(true);
                        setIsAddressOpen(false);
                    }}
                >
                    Profile
                </button>
                <button
                    onClick={() => {
                        setIsProfileOpen(false);
                        setIsAddressOpen(true);
                    }}
                >
                    Add Address
                </button>
            </div>

            {/* Profile Form */}
            {isProfileOpen && (
                <form onSubmit={handleUserSubmit}>
                    {img && <img src={img} alt="Profile" />}
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                    <input
                        type="password"
                        value={passwordAdmin}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        minLength="6"
                        maxLength="10"
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
                        {loading ? 'Updating...' : 'Save'}
                    </button>
                    {error && <p className="error">{error}</p>}
                </form>
            )}

            {/* Address Form */}
            {isAddressOpen && (
                <form onSubmit={handleAddressSubmit}>
                    <input
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="Street"
                        required
                    />
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        required
                    />
                    <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="State"
                        required
                    />
                    <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="Postal Code"
                        required
                    />
                    <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Country"
                        required
                    />


                        <select
                            value={contacts.startsWith('+') ? contacts.slice(0, 3) : '+91'} // Default to +91
                            onChange={(e) => {
                                const selectedCode = e.target.value;
                                setContacts(selectedCode); // Reset contacts input to the new country code
                            }}
                        >
                            {contactOptions.map((option) => (
                                <option key={option.code} value={option.code}>
                                    {option.name} ({option.code})
                                </option>
                            ))}
                        </select>
                        <input

                            type="tel" // Change to tel for better mobile number handling
                            value={contacts}

                            onChange={(e) => {
                                const input = e.target.value;

                                // Ensure the input starts with the selected contact code and restrict length
                                if (input.length <= 14) {
                                    if (input.startsWith('+') || input.length === 3) {
                                        setContacts(input);
                                    }
                                }
                            }}
                            placeholder="+91 xxxxx.."
                            required
                        />

                    <input
                        type="text"
                        value={apartmentNumber}
                        onChange={(e) => setApartmentNumber(e.target.value)}
                        placeholder="Apartment Number"
                    />
                    <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="Landmark"
                    />
                    <button type="submit" disabled={loading}>
                        Save
                    </button>
                    {error && <p className="error">{error}</p>}
                </form>
            )}
        </div>
    );
};

export default Account;
