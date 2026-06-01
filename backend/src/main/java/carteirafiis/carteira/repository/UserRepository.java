package carteirafiis.carteira.repository;

import carteirafiis.carteira.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserModel, Integer> {
    public boolean existsByEmail(String email);

    UserModel findByEmail(String email);
}
