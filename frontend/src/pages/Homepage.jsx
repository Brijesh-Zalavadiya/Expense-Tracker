import bg_1 from '../assets/bg_1.jpg';
import Navbar from '../components/Navbar';

const Homepage = () => {
    return (
        <div className="w-screen h-screen bg-gray-800">
            <Navbar />
            <div className="z-10 h-full flex">
                <img
                    src={bg_1}
                    alt="img"
                    className="w-1/2 h-full mask-r-from-10% opacity-50 object-cover"
                />
            </div>
        </div>
    );
};

export default Homepage;
