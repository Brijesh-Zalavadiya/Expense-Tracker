package com.example.backend.service;

import com.example.backend.dto.UserRequestDTO;
import com.example.backend.dto.UserResponseDTO;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponseDTO getUserById(Long id){
        User user = userRepository.findById(id)
                .orElseThrow(()->new RuntimeException("User not found"));
        return convertToUserResponse(user);
    }

    public List<UserResponseDTO> getAllUsers(){
        return userRepository.findAll()
                .stream()
                .map(this::convertToUserResponse)
                .toList();
    }

    public UserResponseDTO updateUser(Long id, User updatedUser){
        User existingUser = userRepository.findById(id)
                .orElseThrow(()->new RuntimeException("User not found."));

        if(updatedUser.getName()!=null){
            existingUser.setName(updatedUser.getName());
        }
        if(updatedUser.getEmail()!=null){
            existingUser.setEmail(updatedUser.getEmail());
        }
        if(updatedUser.getPassword()!=null){
            existingUser.setPassword(updatedUser.getPassword());
        }

        User newUser = userRepository.save(existingUser);
        return convertToUserResponse(newUser);
    }

    public UserResponseDTO signup(UserRequestDTO dto){
        if(userRepository.findByEmail(dto.getEmail()).isPresent()){
            throw new RuntimeException("Email already registered");
        }

        User user = new User();

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());

        User savedUser = userRepository.save(user);

        return convertToUserResponse(savedUser);
    }

    public void deleteUser(Long id){
        User user = userRepository.findById(id)
                .orElseThrow(()->new RuntimeException("User not found"));
        userRepository.delete(user);
    }

    private UserResponseDTO convertToUserResponse(User user){
        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }
}
