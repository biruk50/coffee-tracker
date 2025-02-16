import { useState } from "react";
import Authentication from "./Authentication";
import Modal from "./Modal";
import { useAuth } from "../Context/AuthContext";


export default function Layout(props) {
    const { children} = props;
    const [showModal,setShowModal] = useState(false);
    const { globalUser , logOut}=useAuth();

    const header = (
        <header>
            <div>
                <h1 className="text-gradient">
                Coffee Tracker
                </h1>
            </div> 

            {globalUser ? (
                <button onClick={() => { logOut()} }>
                <p>Logout</p>
            </button>)
            : 
            (<button onClick={() => { setShowModal(true)} }>
                <p>Sign Up for Free</p>
                <i className="fa-solid fa-mug-hot"></i>
            </button>)
            }
        </header>
    );

    const footer = (
        <footer>
            <p>
                This was made by <a target="_blank" href="https://github.com/biruk50">Biruk Worku</a>
            </p>
            
        </footer>
    );

  return (
    <>
        {showModal && (
            <Modal handleCloseModal={() => {setShowModal(false)}}>
            <Authentication handleCloseModal={() => {setShowModal(false)}} />
            </Modal> )
        }

        {header}
        <main>
            {children}
        </main>
        {footer}
    </>
  )
}