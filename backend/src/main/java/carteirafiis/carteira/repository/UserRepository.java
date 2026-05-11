package carteirafiis.carteira.repository;

import carteirafiis.carteira.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserModel, Integer> {
    public boolean existsByEmail(String email);

}
