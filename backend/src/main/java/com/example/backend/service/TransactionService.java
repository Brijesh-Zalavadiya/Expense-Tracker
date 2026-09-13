package com.example.backend.service;

import com.example.backend.entity.Transaction;
import com.example.backend.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public List<Transaction> getAllTransactions(){
        return transactionRepository.findAll();
    }

    public Transaction getTransactionById(Long id){
        return transactionRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Transaction not found"));
    }

    public Transaction addTransaction(Transaction transaction){
        return transactionRepository.save(transaction);
    }

    public Transaction updateTransaction(Long id, Transaction updatedTransaction){
        Transaction existingTransaction = transactionRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Transaction not found"));

        if(updatedTransaction.getAmount()!=null){
            existingTransaction.setAmount(updatedTransaction.getAmount());
        }

        if(updatedTransaction.getType()!=null){
            existingTransaction.setType(updatedTransaction.getType());
        }

        if(updatedTransaction.getDescription()!=null){
            existingTransaction.setDescription(updatedTransaction.getDescription());
        }

        if(updatedTransaction.getTransactionDate()!=null){
            existingTransaction.setTransactionDate(updatedTransaction.getTransactionDate());
        }

        if(updatedTransaction.getCategory()!=null){
            existingTransaction.setCategory(updatedTransaction.getCategory());
        }

        if(updatedTransaction.getUser()!=null){
            existingTransaction.setUser(updatedTransaction.getUser());
        }
        return transactionRepository.save(existingTransaction);
    }

    public void deleteTransaction(Long id){
        transactionRepository.deleteById(id);
    }
}
