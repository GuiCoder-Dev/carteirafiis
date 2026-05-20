package carteirafiis.carteira.repository;


import carteirafiis.carteira.model.TransactionModel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<TransactionModel,Integer> {
    List<TransactionModel> findByFiiId(Integer fiiId);

}
