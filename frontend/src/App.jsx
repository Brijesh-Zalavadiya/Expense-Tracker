import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [data, setData] = useState([]);

    const getData = async () => {
        const response = await axios.get(
            'http://localhost:8080/api/transactions',
        );
        setData(response.data);
    };
    return (
        <div className="w-full h-screen">
            <h1 className="text-black text-2xl h-fit w-full text-center">
                Transaction Details
            </h1>
            <button
                className="border-2 border-black rounded-2xl my-5 w-fit px-5"
                onClick={getData}
            >
                Get details
            </button>

            <div className="mx-10">
                <table className="w-full border-2 text-center p-5">
                    <tr className="border-2 *:border-black *:p-2 *:text-center w-full *:h-fit">
                        <th>Sr.</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Type</th>
                        <th>Transaction Date</th>
                    </tr>

                    {data.map((transaction) => (
                        <tr
                            className="*:p-2 *:text-center w-full *:h-fit "
                            key={transaction.id}
                        >
                            <td>{transaction.id}</td>
                            <td>{transaction.description}</td>
                            <td>{transaction.amount.toFixed(2)}</td>
                            <td>{transaction.transactionDate}</td>
                            <td>{transaction.type}</td>
                        </tr>
                    ))}
                </table>
            </div>
        </div>
    );
};

export default App;
