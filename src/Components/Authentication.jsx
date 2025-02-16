import { useState } from "react"
import { useAuth } from "../Context/AuthContext";

export default function Authentication(props) {
    const {handleCloseModal} =props;

    const [isRegistration, setIsRegistration] =useState(false);
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [isauthenticating,setIsAuthenticating] = useState(false);
    const [error, setError]=useState(null);

    const {signUp, loginIn } =useAuth();

    async function handleAuthenticate() {
        if (!email || !email.includes('@') || !password || password.length < 6 || isauthenticating){
            return ;
        }

        try{
            setIsAuthenticating(true);
            setError(null);

            if (isRegistration){
                await signUp(email,password);
            }
            else{
                //login
                await loginIn(email,password);
            }
            handleCloseModal();
            
        }
        catch(error){
            setError(error.message);
        }
        finally{
            setIsAuthenticating(false);
        }
    }

    return (
        <>
            <h2 className="sign-up-text">{ isRegistration? 'Sign Up' : 'Login'} </h2>
            <p>{isRegistration ? 'Create an account' :'Sign in to your Account'}</p>
            {error && (<p>❌ {error}</p>)}
            <input onChange={(e) => {setEmail(e.target.value)}} value={email} placeholder="Email"></input>
            <input onChange={(e) => {setPassword(e.target.value)}} value={password} placeholder="******" type="password"></input>
            <button onClick={handleAuthenticate}>
                <p>{ isauthenticating ? 'Authenticating...' :'Submit'}</p>
            </button>
            <hr/>

            <div className="register-content">
                <p>{isRegistration ? 'Already have an account?' : 'Don\'t have an account?'}</p>
                <button onClick={() => {setIsRegistration(!isRegistration)}}>
                <p>{ isRegistration? 'Sign in' : 'Sign up'} </p>
                </button>
            </div>
        </>
    )
}