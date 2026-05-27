package carteirafiis.carteira.repository;

import carteirafiis.carteira.model.EarningsModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EarningsRepository extends JpaRepository<EarningsModel, Integer> {

}
