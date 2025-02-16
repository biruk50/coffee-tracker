import { useState } from 'react'
import {coffeeOptions} from '../Utils'
import Modal from './Modal';
import Authentication from './Authentication';
import { useAuth } from '../Context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function CoffeeForm(props) {
    const {isAuthenticated}=props;
    const [showModal,setShowModal]= useState(false);

    const [coffeeSelected, setCoffeeSelected]= useState(null);
    const [showOtherOption,setShowOtherOption] = useState(false);
    const [coffeeCost, setCoffeeCost] =useState(0);
    const [hour,setHour] =useState(null);
    const [minute,setMinute] =useState(null);

    const { globalUser,globalData , setGlobalData} = useAuth();

    async function HandleSubmitForm(){
        if (!isAuthenticated){
            setShowModal(true);
            return
        }
        if (!coffeeSelected) {return};

        try{
            //create a new data object
        
        const newGlobalData = {
            ...(globalData || {})
        }

        const nowTime= Date.now();
        const timeToSubtract = (hour * 60 * 60 * 1000) + (minute * 60 * 100)
        const timeStamp = nowTime - timeToSubtract;

        const newData= {
            name: coffeeSelected,
            cost: coffeeCost
        };

        newGlobalData[timeStamp] = newData;
        //update the global state
        setGlobalData(newGlobalData);
        //persist this data on firebase
        const userRef = doc(db ,'users', globalUser.uid);
        const res = await setDoc(userRef, {
            [timeStamp]: newData
        } , {merge: true});

        setCoffeeSelected(null);
        setCoffeeCost(0);
        setHour(null);
        setMinute(null);

        }
        catch(err){
            console.error(err.message);
        }
        

    }

    return (
        <>
        {showModal && (
                    <Modal handleCloseModal={() => {setShowModal(false)}}>
                    <Authentication handleCloseModal={() => {setShowModal(false)}}/>
                    </Modal> )
        }
            
        <div className="section-header">
            <h2>Start Tracking Today</h2>
        </div>
        <h4>Select Coffee Type</h4>
        <div className="coffee-grid">
            {coffeeOptions.slice(0,5).map((option,optionIndex) => {
                return (
                    <button onClick={() => {
                        setCoffeeSelected(option.name);
                        setShowOtherOption(false);}}
                     className={'button-card '+ (option.name===coffeeSelected ? ' coffee-button-selected':'') } key={optionIndex}>
                    <h4>{option.name}</h4>
                    <p>{option.caffeine} mg</p>
                    </button>
                )      
                
            })}
        
            <button onClick={() => {
                setShowOtherOption(true);
                setCoffeeSelected(null);}} className='button-card'>
                <h4> Other</h4>
            </button>
        </div>
        
        {showOtherOption &&
            <select onChange={(event) => {setCoffeeSelected(event.target.value)}} id='coffee-list' name="coffee-list">
            <option value ={null}> Select type</option>
            {coffeeOptions.map((option,optionIndex) => {
                return (
                    <option value= {option.name} key={optionIndex}>
                        {option.name} ({option.caffeine}mg)
                    </option>
                )      
                
            })}
        </select>
        }

        <h4>Add the cost </h4>
        <input value={coffeeCost} onChange={(e) => {
            setCoffeeCost(e.target.value)}} 
        className='w-full' type='number' min="0" placeholder='4.50'/>

        <div class="time-container">
            <div>
            <h4>Hour</h4>
            <input value={hour} onChange={(e) => {
            setHour(e.target.value)}}
            type="number" id="hour" placeholder="1 to 23" min="1" max="23" />
            </div>

            <div>
            <h4>Minutes</h4>
            <input value={minute} onChange={(e) => {
            setMinute(e.target.value)}}
            type="number" id="minute" placeholder="0 to 59" min="0" max="60" />
            </div>
        </div>
        <button onClick={HandleSubmitForm}>
            <p>Add Entry</p>
        </button>
        </>
    )
}