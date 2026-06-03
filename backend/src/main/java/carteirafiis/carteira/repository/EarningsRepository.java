package carteirafiis.carteira.repository;

import carteirafiis.carteira.model.EarningsModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EarningsRepository extends JpaRepository<EarningsModel, Integer> {

    Page<EarningsModel> findByFii_UserId(Integer id, Pageable pageable);
}
