package carteirafiis.carteira.service;

import carteirafiis.carteira.enums.transaction.TransactionType;
import carteirafiis.carteira.model.TransactionModel;
import carteirafiis.carteira.repository.TransactionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    // create transaction (post)

    public void createTransaction(TransactionModel transaction){

        if(transaction.getType() == TransactionType.VENDA ){
            int totalQuantity = getQuantity(transaction.getFii().getId());

            if (transaction.getQuantity() > totalQuantity) {
                throw new RuntimeException("Quantidade insuficiente. Você possui "  + totalQuantity + " cotas de " + transaction.getFii().getCode());
            }
        }

        BigDecimal totalExpense = calculateTotalExpense(transaction);
        transaction.setTotalExpense(totalExpense);

        transactionRepository.save(transaction);
    }

    // calculo do total gasto (qtd * unit price)

    private BigDecimal calculateTotalExpense(TransactionModel transaction){
        int quantity = transaction.getQuantity();
        BigDecimal unitPrice = transaction.getUnitPrice();

        BigDecimal totalExpense = unitPrice.multiply(BigDecimal.valueOf(quantity));
        return totalExpense;
    }

    // pega soma as quantidades de fiis

    private int getQuantity(Integer fiiId){
        return transactionRepository.findByFiiId(fiiId)
                .stream()
                .mapToInt(t -> t.getType() == TransactionType.COMPRA
                        ? t.getQuantity()
                        : -t.getQuantity())
                .sum();
    }

    // pega o Modelo com base no id

    public TransactionModel getById(int id){
        return transactionRepository.findById(id).orElseThrow();
    }

    // listar transactions (get)
    public Page<TransactionModel> listTransaction(Pageable pageable){
        return transactionRepository.findAll(pageable);
    }

    // deletar (delete)
    public void deleteTransaction(TransactionModel transaction){

        if (transaction.getType() == TransactionType.COMPRA) {

            int totalNow = getQuantity(transaction.getFii().getId());
            int totalAfterDelete = totalNow - transaction.getQuantity();

            if (totalAfterDelete < 0) {
                throw new RuntimeException("It is not possible to delete this purchase as it will leave the quantity negative.");
            }
        }

        transactionRepository.delete(transaction);
    }


}
