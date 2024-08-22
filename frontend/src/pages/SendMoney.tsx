import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';


const SendMoney = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const [amount, setAmount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [balance, setBalance] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/account/balance`, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                });
                setBalance(response.data.balance);
            } catch (error) {
                console.error("Failed to fetch balance:", error);
            }
        };

        fetchBalance();
    }, []);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(Number(e.target.value));
    };

    const handleTransfer = async () => {
        if (amount > balance) {
            alert('Insufficient balance');
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/account/transfer`, {
                to: id,
                amount
            }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });
            alert('Transfer successful');
            navigate('/dashboard'); 
        } catch (error) {
            console.error("Transfer failed:", error);
            alert('Error during transfer');
        }finally{
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/signin"; 
    };

    return (
        <div className="flex flex-col justify-center h-screen bg-gray-100">
            <div className="flex flex-col h-full">
                <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg mx-auto">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h2 className="text-3xl font-bold text-center">Send Money</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                                <span className="text-2xl text-white">{name ? name[0].toUpperCase() : "?"}</span>
                            </div>
                            <h3 className="text-2xl font-semibold">{name}</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    htmlFor="amount"
                                >
                                    Amount (in Rs)
                                </label>
                                <input
                                    onChange={handleAmountChange}
                                    type="number"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    id="amount"
                                    placeholder="Enter amount"
                                    min="0"
                                />
                            </div>
                            <button
                                onClick={handleTransfer}
                                className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white"
                            >
                                {loading ? 'Processing...' : 'Initiate Transfer'}
                            </button>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="mt-4 mx-auto w-96 rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 bg-green-800 text-white"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};
export default SendMoney