package carteirafiis.carteira.repository;


import carteirafiis.carteira.model.TransactionModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TransactionRepository extends JpaRepository<TransactionModel,Integer> {

    List<TransactionModel> findByFii_UserIdAndDateLessThanEqual(Integer userId, LocalDate endOfMonth);

    List<TransactionModel> findByFii_UserIdAndDateBetween(Integer userId, LocalDate startOfMonth, LocalDate endOfMonth);

    List<TransactionModel> findByFiiId(Integer fiiId);

    List<TransactionModel> findByFii_IdAndDateLessThanEqual(Integer id, LocalDate now);
}
