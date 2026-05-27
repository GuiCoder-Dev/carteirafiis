package carteirafiis.carteira.service;

import carteirafiis.carteira.enums.transaction.TransactionType;
import carteirafiis.carteira.model.EarningsModel;
import carteirafiis.carteira.model.TransactionModel;
import carteirafiis.carteira.repository.EarningsRepository;
import carteirafiis.carteira.repository.TransactionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class EarningsService {

    private final EarningsRepository earningsRepository;
    private final TransactionRepository transactionRepository;


    public EarningsService(EarningsRepository earningsRepository, TransactionRepository transactionRepository) {
        this.earningsRepository = earningsRepository;
        this.transactionRepository = transactionRepository;
    }

    // create earning (post)

    public void create(EarningsModel earningsModel) {
        List<TransactionModel> transactions = transactionRepository
                .findByFii_UserIdAndDateLessThanEqual(earningsModel.getFii().getUser().getId(), earningsModel.getPaymentDate());

        int quantity = getQuantity(transactions, earningsModel.getFii().getId());

        BigDecimal totalGain = earningsModel.getUnitValuePayment().multiply(BigDecimal.valueOf(quantity));

        EarningsModel earnings = new EarningsModel();
        earnings.setFii(earningsModel.getFii());
        earnings.setUnitValuePayment(earningsModel.getUnitValuePayment());
        earnings.setPaymentDate(earningsModel.getPaymentDate());
        earnings.setTotalGain(totalGain);

        earningsRepository.save(earnings);
    }


    // pega o FiiId e soma as quantidades (de acordo com cada usuário)

    public int getQuantity(List<TransactionModel> transactions, Integer fiiId) {

        int quantity = 0;
        for(int i = 0; i < transactions.size(); i++) {
            TransactionModel t = transactions.get(i);

            if(!t.getFii().getId().equals(fiiId)) {
                continue;
            }

            if(t.getType() == TransactionType.COMPRA){
                quantity += t.getQuantity();
            } else {
                quantity -= t.getQuantity();
            }
        }

        return quantity;

    }

    // list earning (get)
    public Page<EarningsModel> listEarnings(Pageable pageable) {
        return earningsRepository.findAll(pageable);
    }

    // pega o Modelo com base no id
    public EarningsModel getById(int id){
        return earningsRepository.findById(id).orElseThrow();
    }

    // atualizar (put)
    public void updateEarnings(EarningsModel earningsModel){
        List<TransactionModel> transactions = transactionRepository
                .findByFii_UserIdAndDateLessThanEqual(earningsModel.getFii().getUser().getId(), earningsModel.getPaymentDate());

        int quantity = getQuantity(transactions, earningsModel.getFii().getId());

        BigDecimal totalGain = earningsModel.getUnitValuePayment().multiply(BigDecimal.valueOf(quantity));

        earningsModel.setTotalGain(totalGain);

        earningsRepository.save(earningsModel);
    }

    // deletar (delete)
    public void deleteEarnings(EarningsModel earningsModel){
        earningsRepository.deleteById(earningsModel.getId());
    }



}



