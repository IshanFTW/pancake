import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Appbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/signin");
    };

    const [username, setUsername] = useState<string>("U");
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/v1/user/profile", {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                });
                setUsername(response.data.firstName);
            } catch (error) {
                console.error("Failed to fetch logged-in user ID:", error);
            }
        };

        fetchUserId();
    }, []);

    return <div className="shadow h-14 flex justify-between">
        <div className="flex flex-col justify-center h-full ml-4">
            PANCAKE
        </div>
        <div className="flex items-center">
            <div className="flex flex-col justify-center h-full mr-4">
                {username}
            </div>
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {username[0]}
                </div>
            </div>
            <button 
                    onClick={handleLogout} 
                    className="text-white bg-green-400 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2.5">
                    Log Out
                </button>
        </div>
        
    </div>
}