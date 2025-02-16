import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut} from "firebase/auth";
import { useState,useEffect, useContext, createContext } from "react";
import { auth ,db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();


export function useAuth(){
    return useContext(AuthContext);
}

export function AuthProvider(props){
    const {children} =props;
    const [globalUser, setGlobalUser] = useState(null);
    const [globalData, setGlobalData]=useState(null);
    const [isLoading, setIsLoading]=useState(false);
    
    function signUp(email,password){
        return createUserWithEmailAndPassword(auth,email,password);
    }
    function loginIn(email,password){
        return signInWithEmailAndPassword(auth,email,password);
    }

    function resetPassword(email){
        return sendPasswordResetEmail(auth,email);
    }

    function logOut(){
        setGlobalUser(null);
        setGlobalData(null);
        return signOut(auth);
    }

    const value = {globalUser , globalData, setGlobalData, isLoading ,signUp, loginIn,resetPassword,logOut};
    //we can access it from anywhere
    
    useEffect(() => {
        const unsubscribed = onAuthStateChanged(auth, async (user) => {
            // if there is no user,empty the globalUser state & return from this event handler
            setGlobalUser(user);

            if (!user || isLoading) { return}

            //if the user has data in the database , fetch the data 
            try{
                setIsLoading(true);
                //first we create a reference for the document (labelled json object)
                //then we get the doc and snapshot it to see if there is anything there
                const docRef = doc(db, 'users' , user.uid);
                const docSnap = await getDoc(docRef);

                let firebaseData={}
                if (docSnap.exists()){
                    firebaseData=docSnap.data();
                }
                setGlobalData(firebaseData);
            }
            catch(err){
                console.error(err);
            }
            finally{
                setIsLoading(false);
            }
        });
        return  unsubscribed //this is to  clean it up after we close our app

    }, []
    )

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
    
}

