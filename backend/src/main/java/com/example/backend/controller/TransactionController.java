package com.example.backend.controller;


import com.example.backend.dto.TransactionRequestDTO;
import com.example.backend.dto.TransactionResponseDTO;
import com.example.backend.entity.Transaction;
import com.example.backend.service.TransactionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:3000"
})public class TransactionController {
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public List<TransactionResponseDTO> getAllTransaction(){
        return transactionService.getAllTransactions();
    }

    @GetMapping("/{id}")
    public TransactionResponseDTO getTransaction(@PathVariable Long id){
        return transactionService.getTransactionById(id);
    }

    @PostMapping
    public TransactionResponseDTO addTransaction(@RequestBody TransactionRequestDTO dto){
        return transactionService.addTransaction(dto);
    }

    @PatchMapping("/{id}")
    public TransactionResponseDTO updateTransaction(@PathVariable Long id, @RequestBody Transaction transaction){
        return transactionService.updateTransaction(id, transaction);
    }

    @DeleteMapping("/{id}")
    public String deleteTransaction(@PathVariable Long id){
        transactionService.deleteTransaction(id);
        return "Transaction deleted successfully";
    }
}
