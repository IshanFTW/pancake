import { useNavigate } from 'react-router-dom';

export const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        
        localStorage.removeItem("token");
        
        navigate("/signin");
    };

    return (
        <button 
            onClick={handleLogout} 
            className="text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5">
            Log Out
        </button>
    );
};
