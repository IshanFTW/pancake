import { Heading } from '../components/Heading'
import { SubHeading } from '../components/SubHeading'
import { InputBox } from '../components/InputBox'
import { Button } from '../components/Button'
import { BottomWarning } from '../components/BottomWarning'
import { useState } from 'react'
import axios, { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'

const Signin = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();

    const handleSignin = async () => {
        try{
            const response = await axios.post(`${import.meta.env.REACT_APP_BACKEND_URL}/api/v1/user/signin`,{
                username,
                password
            })
            if (response.data.token){
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("userId", response.data.userId); 
                navigate("/dashboard");
            }else{
                console.log("Token not returned in response");
            }
        }catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                if (axiosError.response && axiosError.response.status === 401) {
                    alert('Invalid email or password');
                } else {
                    console.log("SignIn Failed: ", axiosError.message);
                }
            } else {
                console.log("Unexpected Error: ", error);
            }
        }
    }

  return (
    <div className="bg-slate-300 h-screen flex justify-center" >
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
            <Heading label={"Sign In"}/>
            <SubHeading label={"Enter your credentials to access your account"} />
            <InputBox onChange={e => {setUsername(e.target.value)}} label={"Email"} placeholder={"matt@example.com"}/>
            <InputBox onChange={e => {setPassword(e.target.value)}}label={"Password"} placeholder={"min 6 characters"}/>
            <div className="pt-4">
                <Button onClick={handleSignin} label={"Sign In"}/>
            </div>
            <BottomWarning label={"Don't have an account"} buttonText={"Sign Up"} to={"/signup"}/>
            </div>
        </div>
    </div>
  )
}

export default Signin