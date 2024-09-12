import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css';
import cine from '../assets/0.png';
import coll from '../assets/gandr-collage.jpg';



const url = "http://127.0.0.1:8000/auth"

const Login = ({ setAuth }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("email , Password");
        const data = { email, password }
        if (email == "" || password == "") {
            setErrorMessage("Invalid Credentials")
            toast(errorMessage, { type: "error", theme: "light" })
        } else {
            axios.post(`${url}/loginUser`, data).then((response) => {
                if (response.status == 200) {
                    const token = response.data.token
                    if (token) {
                        localStorage.setItem("token", token);
                        setAuth(true,token);
                        handleClick();
                        toast.success("Logged in Successfully");
                    } else {
                        toast.error("LOG IN FAILED");
                    }
                } else {
                    setErrorMessage("Login Failed")
                    toast(errorMessage, { type: "error", theme: "light" })
                }
            })
        }
    }
    const handleClick = () =>{
        navigate(`/register`);
    }
    const mainStyles = {
        width: '43%',
        height: '70%',
        backgroundImage: `url(${coll})`,
        boxShadow: '-7px 9px 21.9px 15px rgba(0, 0, 0, 0.25)',
        backgroundSize: '869px',
        marginRight: '75px',
        objectPosition: '25% 25% 25% 25%',
        borderRadius: '40px',
        opacity: 1,
        flexShrink: 0,
    };

    const containerStyles = {
        position: 'relative',
        height: '70%',
        width: '60%',
        marginTop: '10%',
        marginLeft: '18%',
        padding: '16px',
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '40px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    };

    const inputStyles = {
        width: '75%',
        marginLeft: '9%',
        marginBottom: '8%',
        border: '2px solid black',
        padding: '15px',
        borderRadius: '10px',
        fontFamily: '"Libre Franklin"',
        fontSize: '16px',
        fontStyle: 'normal',
        fontWeight: 400,
    };

    const buttonStyles = {
        backgroundColor: 'black',
        width: '60%',
        height: '14%',
        borderRadius: '30px',
        marginTop: '10%',
        marginLeft: '20%',
        marginBottom: '25%',
        border: 'none',
        padding: '0px',
        cursor: 'pointer',
        fontFamily: 'Inter',
        fontSize: '30px',
        fontStyle: 'normal',
        fontWeight: 900,
        lineHeight: 'normal',
        color: 'white',
        transition: '0.7s',
    };

    const regStyles = {
        background: 'transparent',
        border: 'none',
        fontFamily: 'Inter',
        textDecorationLine: 'underline',
        fontSize: '30px',
        fontStyle: 'normal',
        fontWeight: 900,
        lineHeight: 'normal',
        color: 'white',
        marginTop: '42px',
        marginLeft: '2px',
    };

    const reg1Styles = {
        background: 'transparent',
        border: 'none',
        fontFamily: 'Inter',
        fontSize: '30px',
        fontStyle: 'normal',
        fontWeight: 900,
        lineHeight: 'normal',
        color: 'white',
        marginTop: '50px',
    };

    return (
        <body style={{ backgroundColor: 'black', background: 'radial-gradient(112.45% 61.6% at 80.39% 61.34%, #000 0%, #710404 63%, #8B0404 86%, #B90000 100%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100vw', height: '100vh', margin: '0%' }}>
            <img className="cine-img" src={cine} style={{ height: '100vh' }} />
            <div className="text">
                <h2 style={{ textAlign: 'center', fontFamily: 'Inter', fontSize: '40px', fontStyle: 'normal', fontWeight: 900, lineHeight: 'normal', color: 'white' }}>
                    Guess We'll See You In The <br />
                    Movies
                </h2>
            </div>
            <div style={mainStyles} >
                <form className="container" style={containerStyles} onSubmit={ handleSubmit }>
                    <h1 style={{ color: '#000', fontFamily: 'Inter', fontSize: '36px', fontStyle: 'normal', fontWeight: 900, textAlign: 'center', marginBottom: '20px' }}>
                        LOGIN
                    </h1>
                    <input type="text" value={email} placeholder="E-mail" name="email" id="email" required style={inputStyles} onChange={(e) => setEmail(e.target.value)}/>
                    <input type="password" value={password} placeholder="Password" name="password" id="password" required style={inputStyles} onChange={(e) => setPassword(e.target.value)}/>
                    <button type="submit" className="button transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300" style={buttonStyles} >
                        Login
                    </button>
                </form>

                <div className="Register" style={{ marginTop: '8%', marginLeft: '12%', display: 'flex' }}>
                    <h3 style={reg1Styles}>
                        Do not have an Account ?
                    </h3>
                    <button type="submit" className="reg" style={regStyles} onClick={handleClick}>
                        Register
                    </button>
                </div>
            </div>
        </body>
    )
}

export default Login