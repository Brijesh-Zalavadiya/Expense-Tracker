import React from 'react';

const Navbar = () => {
    return (
        <div>
            <div className="z-20 bg-gray-800 flex fixed w-full text-shadow-blue-50 text-center flex-col border-b-2 rounded-b-full border-gray-600 py-10">
                <h2 className="text-4xl font-bold text text-blue-50 mt-5">
                    Expense Tracker
                </h2>
                <p className="mt-3 text-gray-500 font-semibold">
                    Beware of little expenses. A small leak will sink a great
                    ship.
                </p>
            </div>
        </div>
    );
};

export default Navbar;
