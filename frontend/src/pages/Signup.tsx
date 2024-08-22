import { useState } from "react"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import { useNavigate } from "react-router-dom"
import axios from "axios"


const Signup = () => {
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [username, setUserName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            const response = await axios.post(`${import.meta.env.REACT_APP_BACKEND_URL}/api/v1/user/signup`, {
                username,
                firstName,
                lastName,
                password,
            });

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                navigate("/dashboard");
            } else {
                console.error("Token not returned in response.");
            }
        } catch (error) {
            console.error("Signup failed:", error);
        }
    };


  return (
    <div className="bg-slate-300 h-screen flex justify-center" >
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
            <Heading label={"Sign Up"}/>
            <SubHeading label={"Enter your information to create an account"} />
            <InputBox onChange= {e => {setFirstName(e.target.value)}} label={"First Name"} placeholder={"Matt"}/>
            <InputBox onChange={e => {setLastName(e.target.value)}} label={"Last Name"} placeholder={"Cook"}/>
            <InputBox onChange = {e => {setUserName(e.target.value)}}label={"Email"} placeholder={"matt@example.com"}/>
            <InputBox onChange={e => {setPassword(e.target.value)}} label={"Password"} placeholder={"min 6 characters"}/>
            <div className="pt-4">
                <Button onClick={handleSignup} label={"Sign Up"}/>
            </div>
            <BottomWarning label={"Already have an account"} buttonText={"Sign In"} to={"/signin"}/>
            </div>
        </div>
    </div>
  )
}

export default Signup