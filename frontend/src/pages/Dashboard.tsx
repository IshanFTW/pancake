import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
    const [balance, setBalance] = useState<string>("");

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:3000/api/v1/account/balance", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBalance(response.data.balance);
            } catch (error) {
                console.log("Error fetching balance: ", error);
            }
        };

        fetchBalance();
    }, []);

    return (
        <div>
            <Appbar />
            <div className="m-8">
                <Balance value={balance ? balance.toLocaleString() : "Loading..."} />
                <Users />
            </div>
        </div>
    );
}

export default Dashboard