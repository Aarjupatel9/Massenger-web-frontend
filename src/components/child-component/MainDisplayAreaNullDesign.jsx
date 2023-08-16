import React, {useContext} from 'react'
import UserContext from '../../context/createContext'
export default function MainDisplayAreaNullDesign() {

    const { currentUser } = useContext(UserContext);


    return (
        <div className="container text-center mt-5" >
            <img
                className='rounded-circle mx-1'
                src={process.env.PUBLIC_URL + '/logo192.png'}
              
            />
            <h1>welcome on massenger {currentUser.username}</h1>
        </div>)
}
