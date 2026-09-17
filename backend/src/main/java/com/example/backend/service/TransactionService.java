package com.example.backend.service;

import com.example.backend.dto.TransactionRequestDTO;
import com.example.backend.dto.TransactionResponseDTO;
import com.example.backend.entity.Category;
import com.example.backend.entity.Transaction;

import com.example.backend.entity.User;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.TransactionRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public TransactionService(
            TransactionRepository transactionRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<TransactionResponseDTO> getAllTransactions(){
        return transactionRepository.findAll()
                .stream()
                .map(this::convertToResponseDTO)
                .toList();
    }

    public TransactionResponseDTO getTransactionById(Long id){
        Transaction transaction =  transactionRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Transaction not found"));

        return convertToResponseDTO(transaction);
    }

    public TransactionResponseDTO addTransaction(TransactionRequestDTO dto){
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(()-> new RuntimeException("User not found"));
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(()-> new RuntimeException("Category not found"));

        Transaction transaction = new Transaction();
        transaction.setAmount(dto.getAmount());
        transaction.setDescription(dto.getDescription());
        transaction.setType(dto.getType());
        transaction.setTransactionDate(dto.getTransactionDate());
        transaction.setUser(user);
        transaction.setCategory(category);

        Transaction savedTransaction = transactionRepository.save(transaction);

        return convertToResponseDTO(savedTransaction);
    }

    public TransactionResponseDTO updateTransaction(Long id, Transaction updatedTransaction){
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
        Transaction newTransaction = transactionRepository.save(existingTransaction);
        return convertToResponseDTO(newTransaction);
    }

    public void deleteTransaction(Long id){
        if(transactionRepository.findById(id).isEmpty()){
            throw new RuntimeException("Transaction doesn't exist.");
        }
        transactionRepository.deleteById(id);
    }

    private TransactionResponseDTO convertToResponseDTO(Transaction transaction){
        return new TransactionResponseDTO(
                transaction.getId(),
                transaction.getAmount(),
                transaction.getDescription(),
                transaction.getTransactionDate(),
                transaction.getType(),
                transaction.getUser().getId(),
                transaction.getCategory().getId()
        );
    }
}
