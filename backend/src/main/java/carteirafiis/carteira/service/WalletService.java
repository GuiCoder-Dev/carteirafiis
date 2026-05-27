package carteirafiis.carteira.service;

import carteirafiis.carteira.controller.response.GetWalletPositionResponse;
import carteirafiis.carteira.enums.transaction.TransactionType;
import carteirafiis.carteira.model.TransactionModel;
import carteirafiis.carteira.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class WalletService {

    private final TransactionRepository transactionRepository;

    public WalletService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public List<GetWalletPositionResponse> getPositionByUser(Integer userId, YearMonth month) {

        LocalDate endOfMonth = month != null ? month.atEndOfMonth() : LocalDate.now();
        LocalDate startOfMonth = month != null ? month.atDay(1) : endOfMonth.withDayOfMonth(1);

        List<TransactionModel> allTransactions = transactionRepository
                .findByFii_UserIdAndDateLessThanEqual(userId, endOfMonth);


        List<TransactionModel> monthTransactions = transactionRepository
                .findByFii_UserIdAndDateBetween(userId, startOfMonth, endOfMonth);


        Map<String, List<TransactionModel>> groupedTotal = allTransactions.stream()
                .collect(Collectors.groupingBy(t -> t.getFii().getCode()));

        Map<String, List<TransactionModel>> groupedMonth = monthTransactions.stream()
                .collect(Collectors.groupingBy(t -> t.getFii().getCode()));


        return groupedTotal.entrySet().stream()
                .map(entry -> {
                    String code = entry.getKey();
                    List<TransactionModel> allFiiTransactions = entry.getValue();

                    List<TransactionModel> monthFiiTransactions = groupedMonth
                            .getOrDefault(code, List.of());

                    int totalQuantity = allFiiTransactions.stream()
                            .mapToInt(t -> t.getType() == TransactionType.COMPRA
                                    ? t.getQuantity()
                                    : -t.getQuantity())
                            .sum();

                    BigDecimal totalExpense = allFiiTransactions.stream()
                            .filter(t -> t.getType() == TransactionType.COMPRA)
                            .map(t -> t.getUnitPrice()
                                    .multiply(BigDecimal.valueOf(t.getQuantity())))
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    BigDecimal averagePrice = totalQuantity > 0
                            ? totalExpense.divide(BigDecimal.valueOf(totalQuantity), 2, RoundingMode.HALF_UP)
                            : BigDecimal.ZERO;

                    // monthly
                    int monthlyQuantity = monthFiiTransactions.stream()
                            .mapToInt(t -> t.getType() == TransactionType.COMPRA
                                    ? t.getQuantity()
                                    : -t.getQuantity())
                            .sum();

                    BigDecimal monthlyExpense = monthFiiTransactions.stream()
                            .filter(t -> t.getType() == TransactionType.COMPRA)
                            .map(t -> t.getUnitPrice()
                                    .multiply(BigDecimal.valueOf(t.getQuantity())))
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    String type = allFiiTransactions.get(0).getFii().getType().name();

                    return new GetWalletPositionResponse(code, type, monthlyQuantity, totalQuantity, monthlyExpense, totalExpense, averagePrice);
                })
                .filter(p -> p.totalAccumulatedQuantity() > 0)
                .toList();
    }

}
