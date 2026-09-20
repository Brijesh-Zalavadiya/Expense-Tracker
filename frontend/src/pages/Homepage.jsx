import { useState } from 'react';
import bg_1 from '../assets/bg_1.jpg';
import Navbar from '../components/Navbar';
import Login from './login';
import Signup from './signup';

const Homepage = () => {
    const [auth, setAuth] = useState('Login');

    return (
        <div className="w-screen h-screen bg-slate-950 overflow-hidden">
            <Navbar />

            <div className="z-10 h-full flex">
                <img
                    src={bg_1}
                    alt="img"
                    className="w-1/2 h-full mask-r-from-10% opacity-40 object-cover"
                />

                <div className="justify-center items-center w-1/2 h-full flex bg-slate-950/80">
                    <div
                        key={auth}
                        className={
                            auth === 'Login' ? 'auth-login' : 'auth-signup'
                        }
                    >
                        {auth === 'Login' ? (
                            <Login setAuth={setAuth} />
                        ) : (
                            <Signup setAuth={setAuth} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homepage;
