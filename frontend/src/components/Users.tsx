import { useEffect, useState } from "react";
import { Button } from "./Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
}

export const Users = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filter, setFilter] = useState<string>("");
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/user/profile`, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                });
                const userId = response.data._id;

                const usersResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/user/bulk?filter=` + filter, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                });
                const filteredUsers = usersResponse.data.user.filter((user: User) => user._id !== userId);
                setUsers(filteredUsers);
            } catch (error) {
                console.error("Failed to fetch logged-in user ID:", error);
            }finally {
                setLoading(false);
            }
        };

        fetchUserId();
    }, [filter]);

    if (loading) {
        return <div>Loading users...</div>;
    }

    return (
        <>
            <div className="font-bold mt-6 text-lg">
                Users
            </div>
            <div className="my-2">
                <input
                    onChange={(e) => setFilter(e.target.value)}
                    type="text"
                    placeholder="Search users..."
                    className="w-full px-2 py-1 border rounded border-slate-200"
                />
            </div>
            <div>
                {users.map(user => (
                    <UserItem key={user._id} user={user} />
                ))}
            </div>
        </>
    );
}

const UserItem = ({ user }: { user: User }) => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-between">
            <div className="flex">
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                    <div className="flex flex-col justify-center h-full text-xl">
                        {user.firstName[0]}
                    </div>
                </div>
                <div className="flex flex-col justify-center h-full">
                    <div>
                        {user.firstName} {user.lastName}
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center h-full">
                <Button
                    onClick={() => {
                        navigate("/send?id=" + user._id + "&name=" + user.firstName);
                    }}
                    label={"Send Money"}
                />
            </div>
        </div>
    );
}
