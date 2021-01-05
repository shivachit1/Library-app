import { USER_LOGIN } from '../queries'
import { useMutation } from '@apollo/client'
import { useState, useEffect } from 'react';

const Login = ({ setError, setToken }) => {

    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('secred')

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
                    username:
                    <input name="username" placeholder="username"
                    onChange={({target})=>setUsername(target.value)}></input>
                </div>

                <div>
                    password:
                    <input name="password" value={password} placeholder="password"></input>
                </div>
                <button>login</button>
            </form>
        </div>
    )
}

export default Login