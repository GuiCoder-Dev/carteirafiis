package carteirafiis.carteira.service;


import carteirafiis.carteira.model.FiiModel;
import carteirafiis.carteira.model.UserModel;
import carteirafiis.carteira.repository.FiiRepository;
import carteirafiis.carteira.security.AuthUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class FiiService {

    private final FiiRepository fiiRepository;
    private final AuthUtil authUtil;

    public FiiService(FiiRepository fiiRepository, AuthUtil authUtil) {
        this.fiiRepository = fiiRepository;
        this.authUtil = authUtil;
    }

    // create fii (post)

    public void createFii(FiiModel fiiModel){
        fiiRepository.save(fiiModel);
    }

    // listar fiis (get)

    public Page<FiiModel> listFii(Pageable pageable){
        UserModel user = authUtil.getLoggedUser();
        return fiiRepository.findByUserId(user.getId(), pageable);
    }

    // atualizar fii (put)

    public void updateFii(FiiModel fiiModel){
        UserModel user = authUtil.getLoggedUser();

        if (!fiiModel.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("you do not have permission to update this FII");
        }

        fiiRepository.save(fiiModel);
    }

    // pega o Modelo com base no id
    public FiiModel getById(int id){
        return fiiRepository.findById(id).orElseThrow();
    }

    // delete fii (delete)
    public void deleteFii(FiiModel fiiModel){
        UserModel user = authUtil.getLoggedUser();

        if(!fiiModel.getUser().getId().equals(user.getId())){
            throw new RuntimeException("you do not have permission to delete this FII");
        }

        fiiRepository.deleteById(fiiModel.getId());
    }

}
