import React from 'react'
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const LoginPage = ({userInfo, setuserInfo}) => {
    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');
    const [redirect, setredirect] = useState(false);

    const login = async (e)=>{
        e.preventDefault();
        const response = await fetch('http://localhost:3000/login', {
            method : 'POST',
            body : JSON.stringify({username,password}),
            headers : {'Content-Type' : 'application/json'},
            credentials : 'include'
        })
        if(response.ok){
            response.json().then(userInfo=>{
                setuserInfo(userInfo)
            })
            setredirect(true);
            setusername('');
            setpassword('');
        }
        else{
            alert('wrong credentials')
        }
    }

    if(redirect){
        return <Navigate to={'/'}/> 
    }

    return (
        <form className="auth" onSubmit={login}>
            <h1>Log<span className='blue'>in</span></h1>
            <input type="text" 
                className="input" 
                placeholder="Username" 
                value={username}
                onChange={(e)=>{
                    setusername(e.target.value)
                }}
            />
            <input type="password" 
                className="input" 
                placeholder="Password"
                value={password} 
                onChange={(e)=>{
                    setpassword(e.target.value)
                }}
            />

            <button className="animated-button">
                <svg xmlns="http://www.w3.org/2000/svg" className="arr-2" viewBox="0 0 24 24">
                    <path
                        d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                    ></path>
                </svg>
                <span className="text">Login</span>
                <span className="circle"></span>
                <svg xmlns="http://www.w3.org/2000/svg" className="arr-1" viewBox="0 0 24 24">
                    <path
                        d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                    ></path>
                </svg>
            </button>

            <span>Don't have an account? <Link className='loginLink' to="/register">Sign up</Link></span>

        </form>
    )
}

export default LoginPage
