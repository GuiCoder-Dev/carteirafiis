package carteirafiis.carteira.service;


import carteirafiis.carteira.controller.request.ResendCodeRequest;
import carteirafiis.carteira.controller.request.VerifiyEmailRequest;
import carteirafiis.carteira.enums.user.Status;
import carteirafiis.carteira.model.UserModel;
import carteirafiis.carteira.repository.UserRepository;
import com.resend.core.exception.ResendException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    // Create user (post)
    public void createUser(UserModel request) throws ResendException {

        if(userRepository.existsByEmail(request.getEmail())){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        String code = String.format("%06d", new Random().nextInt(999999));

        UserModel user = new UserModel();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // criptografia de senha
        user.setRole(request.getRole());
        user.setStatus(Status.ACTIVE);
        user.setEmailVerified(false);
        user.setVerificationCode(code);
        user.setVerificationCodeExpiration(LocalDateTime.now().plusMinutes(15));

        userRepository.save(user);

        emailService.sendEmail(user.getEmail(), code);
    }


    // verifica e-mail com Resend
    public void verifyEmail(VerifiyEmailRequest request) {

        UserModel user = userRepository.findByEmail(request.email());

        if (user.isEmailVerified()) {
            throw new RuntimeException("Email already verified");
        }

        if (user.getVerificationCodeExpiration().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Verification code expired");
        }

        if(!user.getVerificationCode().equals(request.code())){
            throw new RuntimeException("Invalid verification code");
        }

        user.setEmailVerified(true);
        user.setVerificationCode(null);
        user.setVerificationCodeExpiration(null);

        userRepository.save(user);
    }


    // reenvia código
    public void resendCode(ResendCodeRequest request) throws ResendException {
        UserModel user = userRepository.findByEmail(request.email());

        if (user.isEmailVerified()) {
            throw new RuntimeException("Email already verified");
        }

        String code = String.format("%06d", new Random().nextInt(999999));

        user.setVerificationCode(code);
        user.setVerificationCodeExpiration(LocalDateTime.now().plusMinutes(15));

        userRepository.save(user);

        emailService.sendEmail(user.getEmail(), code);
    }


    // Verifica se o e-mail já existe

    public Boolean existsEmail(String email){

        return !userRepository.existsByEmail(email);
    }

    public void existByEmail(String email){

    }

    // pega o Modelo com base no id
    public UserModel getById(Integer id){

        return userRepository.findById(id).orElseThrow();
    }

}
