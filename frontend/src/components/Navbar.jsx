import React from 'react';
const Navbar = () => {
    return (
        <div>
            <div className="z-20 bg-slate-950/90 backdrop-blur-md flex fixed w-full text-center flex-col border-b rounded-b-full border-slate-800 p-8 select-none">
                <h2 className="text-3xl font-bold text-white tracking-tight">
                    <span className="text-emerald-400">Expense</span>
                    Tracker
                </h2>
                <p className="mt-2 text-slate-500 text-sm font-medium">
                    Beware of little expenses. A small leak will sink a great
                    ship.
                </p>
            </div>
        </div>
    );
};
export default Navbar;
