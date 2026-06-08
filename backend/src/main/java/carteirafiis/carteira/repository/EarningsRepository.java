package carteirafiis.carteira.repository;

import carteirafiis.carteira.model.EarningsModel;
import carteirafiis.carteira.model.FiiModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface EarningsRepository extends JpaRepository<EarningsModel, Integer> {

    Page<EarningsModel> findByFii_UserId(Integer id, Pageable pageable);

    boolean existsByFiiAndPaymentDateBetween(FiiModel fii, LocalDate localDate, LocalDate localDate1);

    List<EarningsModel> findByFii_UserIdAndPaymentDateBetween(Integer id, LocalDate startOfMonth, LocalDate endOfMonth);
}
