package carteirafiis.carteira.service;


import carteirafiis.carteira.model.FiiModel;
import carteirafiis.carteira.repository.FiiRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class FiiService {

    private final FiiRepository fiiRepository;

    public FiiService(FiiRepository fiiRepository) {
        this.fiiRepository = fiiRepository;
    }

    // create fii (post)

    public void createFii(FiiModel fiiModel){
        fiiRepository.save(fiiModel);
    }

    // listar fiis (get)

    public Page<FiiModel> listFii(Pageable pageable){
        return fiiRepository.findAll(pageable);
    }

    // atualizar fii (put)

    public void updateFii(FiiModel fiiModel){
        fiiRepository.save(fiiModel);
    }

    // pega o Modelo com base no id
    public FiiModel getById(int id){
        return fiiRepository.findById(id).orElseThrow();
    }

    // delete fii (delete)
    public void deleteFii(FiiModel fiiModel){
        fiiRepository.deleteById(fiiModel.getId());
    }

}
