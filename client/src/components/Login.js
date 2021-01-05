import { USER_LOGIN } from '../queries'
import { useMutation } from '@apollo/client'
import { useState, useEffect } from 'react';

const Login = ({ setError, setToken }) => {

    const [username,setUsername] = useState('')
    const password = "secred"

    const [userLogin,result] = useMutation(USER_LOGIN,{
        onError: (error) => {
            setError(error.graphQLErrors[0].message)
          } 
    })

    useEffect(()=>{
        if ( result.data ) {
            const token = result.data.login.value
            setToken(token)
            localStorage.setItem('libraryApp-userToken', token)
          }
    },[result.data])

    const login = (e) =>{
        e.preventDefault()
        userLogin({variables:{ username, password }}) 
    }
    return(
        <div>
            <form onSubmit={login}>
                <div>
                    <label>Username:</label>
                    <input name="username" placeholder="username"
                    onChange={({target})=>setUsername(target.value)}></input>
                </div>

                <div>
                <label>Password:</label>
                    <input type="password" name="password" defaultValue={password} placeholder="password"></input>
                </div>
                <button className="greenButton">login</button>
            </form>
            <div>
                <h3>Test with</h3>
                
                <p><strong>username: </strong>shivachit1</p>
                <p><strong>password: </strong>secred</p>
                
            </div>
        </div>
    )
}

export default Login