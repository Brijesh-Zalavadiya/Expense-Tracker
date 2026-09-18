package com.example.backend.controller;

import com.example.backend.dto.LoginRequestDTO;
import com.example.backend.dto.UserRequestDTO;
import com.example.backend.dto.UserResponseDTO;
import com.example.backend.entity.User;
import com.example.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserResponseDTO> getAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserResponseDTO getUserById(@PathVariable Long id){
        return userService.getUserById(id);
    }

    @PostMapping("/signup")
    public UserResponseDTO signup(@RequestBody UserRequestDTO dto){
        return userService.signup(dto);
    }

    @PostMapping("/login")
    public UserResponseDTO login(@RequestBody LoginRequestDTO dto) {
        return userService.login(dto);
    }

    @PatchMapping("/{id}")
    public UserResponseDTO updateUser(@PathVariable Long id, @RequestBody User user){
        return userService.updateUser(id, user);
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id){
        userService.deleteUser(id);
        return "User removed.";
    }
}
