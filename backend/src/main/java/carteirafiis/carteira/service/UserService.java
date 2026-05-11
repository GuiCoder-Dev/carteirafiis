package carteirafiis.carteira.service;


import carteirafiis.carteira.model.UserModel;
import carteirafiis.carteira.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Post
    public void createUser(UserModel user){
        user.setPassword(passwordEncoder.encode(user.getPassword())); // criptografia de senha
        userRepository.save(user);
    }

    public Boolean existsEmail(String email){
        return !userRepository.existsByEmail(email);
    }

}
