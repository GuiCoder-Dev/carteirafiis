package carteirafiis.carteira.repository;

import carteirafiis.carteira.model.FiiModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FiiRepository extends JpaRepository<FiiModel, Integer> {


    Page<FiiModel> findByUserId(Integer id, Pageable pageable);

}
