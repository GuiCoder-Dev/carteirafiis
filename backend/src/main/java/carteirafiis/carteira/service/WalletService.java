package carteirafiis.carteira.service;

import carteirafiis.carteira.controller.response.GetWalletAll;
import carteirafiis.carteira.controller.response.GetWalletPositionResponse;
import carteirafiis.carteira.enums.transaction.TransactionType;
import carteirafiis.carteira.model.EarningsModel;
import carteirafiis.carteira.model.TransactionModel;
import carteirafiis.carteira.model.UserModel;
import carteirafiis.carteira.repository.EarningsRepository;
import carteirafiis.carteira.repository.TransactionRepository;
import carteirafiis.carteira.security.AuthUtil;
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
    private final AuthUtil authUtil;
    private final EarningsRepository earningsRepository;


    public WalletService(TransactionRepository transactionRepository, AuthUtil authUtil, EarningsRepository earningsRepository) {
        this.transactionRepository = transactionRepository;
        this.authUtil = authUtil;
        this.earningsRepository = earningsRepository;
    }

    public List<GetWalletPositionResponse> getPositionByUser(YearMonth month) {

        UserModel user = authUtil.getLoggedUser();

        LocalDate endOfMonth = month != null ? month.atEndOfMonth() : LocalDate.now();
        LocalDate startOfMonth = month != null ? month.atDay(1) : endOfMonth.withDayOfMonth(1);

        List<TransactionModel> allTransactions = transactionRepository
                .findByFii_UserIdAndDateLessThanEqual(user.getId(), endOfMonth);


        List<TransactionModel> monthTransactions = transactionRepository
                .findByFii_UserIdAndDateBetween(user.getId(), startOfMonth, endOfMonth);


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

    public List<GetWalletAll> getAll(YearMonth month) {

        UserModel user = authUtil.getLoggedUser();

        LocalDate endOfMonth = month.atEndOfMonth();
        LocalDate startOfMonth = month.atDay(1);

        List<GetWalletPositionResponse> positions = getPositionByUser(month);

        List<EarningsModel> earnings = earningsRepository
                .findByFii_UserIdAndPaymentDateBetween(user.getId(), startOfMonth, endOfMonth);

        Map<String, EarningsModel> earningsByCode = earnings.stream()
                .collect(Collectors.toMap(e -> e.getFii().getCode(), e -> e));

        return positions.stream()
                .map(position -> {
                    EarningsModel earning = earningsByCode.get(position.fiiCode());

                    BigDecimal unitValuePayment = earning != null ? earning.getUnitValuePayment() : BigDecimal.ZERO;
                    BigDecimal totalGain = earning != null ? earning.getTotalGain() : BigDecimal.ZERO;

                    return new GetWalletAll(
                            position.fiiCode(),
                            position.type(),
                            position.monthlyQuantity(),
                            position.totalAccumulatedQuantity(),
                            position.monthlyExpense(),
                            position.totalExpense(),
                            position.averagePrice(),
                            unitValuePayment,
                            totalGain
                    );

                })
                .toList();


    }




}
