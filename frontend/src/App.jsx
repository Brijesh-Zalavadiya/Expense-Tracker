import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
    const [data, setData] = useState([]);
    const [index, setIndex] = useState(1);

    const [id, setId] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('EXPENSE');
    const [transactionDate, setTransactionDate] = useState('');
    const [userId, setUserId] = useState('');
    const [categoryId, setCategoryId] = useState('');

    const getData = async () => {
        const response = await axios.get(
            `http://localhost:8080/api/transactions`,
        );
        setData(response.data);
    };

    const indexNext = () => {
        setIndex(index + 1);
    };

    const indexBack = () => {
        setIndex(index - 1);
    };

    useEffect(() => {
        getData();
    }, [index]);

    const deleteTransaction = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/transactions/${id}`);
            alert('Transaction deleted successfully');
            getData();
        } catch (error) {
            console.error('Error deleting transaction:', error);
            alert('Failed to delete transaction');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const transaction = {
            description: description,
            amount: Number(amount),
            type: type,
            transactionDate: transactionDate,
            user: {
                id: Number(userId),
            },
            category: {
                id: Number(categoryId),
            },
        };
        console.log('Sending transaction:', transaction);

        try {
            const response = await axios.patch(
                `http://localhost:8080/api/transactions/${id}`,
                transaction,
            );
            console.log(response.data);
            getData();

            setId('');
            setDescription('');
            setAmount('');
            setType('EXPENSE');
            setTransactionDate('');
            setUserId('');
            setCategoryId('');
        } catch (error) {
            console.error('Error adding transaction:', error);
            alert('Failed to add transaction');
        }
    };

    const fillForm = (transaction) => {
        setId(transaction.id);
        setDescription(transaction.description);
        setAmount(transaction.amount);
        setType(transaction.type);
        setTransactionDate(transaction.transactionDate);
        setUserId(transaction.user.id);
        setCategoryId(transaction.category.id);
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

            {/* {data && (
                <div className="mx-10">
                    <table className="w-full border-2 text-center p-5">
                        <thead>
                            <tr className="border-2 *:border-black *:p-2 *:text-center w-full *:h-fit">
                                <th>Sr.</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Type</th>
                                <th>Transaction Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr className="*:p-2 *:text-center w-full *:h-fit ">
                                <td>{data.id}</td>
                                <td>{data.description}</td>
                                <td>{data.amount.toFixed(2)}</td>
                                <td>{data.transactionDate}</td>
                                <td>{data.type}</td>
                                <td><button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 " onClick={() => deleteTransaction(data.id)}>DELETE</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )} */}

            <div className="mx-10">
                <table className="w-full border-2 text-center p-5">
                    <thead>
                        <tr className="border-2 *:border-black *:p-2 *:text-center w-full *:h-fit">
                            <th>Sr.</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Type</th>
                            <th>Transaction Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((transaction, idx) => (
                            <tr
                                className="*:p-2 *:text-center w-full *:h-fit "
                                key={transaction.id}
                                onClick={() => fillForm(transaction)}
                            >
                                <td>{idx + 1}</td>
                                <td>{transaction.description}</td>
                                <td>{transaction.amount.toFixed(2)}</td>
                                <td>{transaction.transactionDate}</td>
                                <td>{transaction.type}</td>
                                <td>
                                    <button
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                        onClick={() =>
                                            deleteTransaction(transaction.id)
                                        }
                                    >
                                        DELETE
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button
                className="border-2 border-black rounded-2xl my-5 w-fit px-5"
                onClick={indexBack}
            >
                Back
            </button>
            <button
                className="border-2 border-black rounded-2xl my-5 w-fit px-5"
                onClick={indexNext}
            >
                Next
            </button>

            <form
                onSubmit={handleSubmit}
                className="border-2 border-black rounded-2xl my-5 w-fit px-5 py-5 flex flex-col gap-3"
            >
                <label htmlFor="description">Description:</label>
                <input
                    type="text"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <label htmlFor="amount">Amount:</label>
                <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <label htmlFor="type">Type:</label>
                <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                </select>
                <label htmlFor="transactionDate">Transaction Date:</label>
                <input
                    type="date"
                    id="transactionDate"
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                />

                <label htmlFor="userId">User ID:</label>
                <input
                    type="text"
                    id="userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <label htmlFor="categoryId">Category ID:</label>
                <input
                    type="text"
                    id="categoryId"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                />

                <button type="submit">Add transaction</button>
            </form>
        </div>
    );
};

export default App;