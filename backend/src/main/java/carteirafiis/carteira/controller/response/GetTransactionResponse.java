package carteirafiis.carteira.controller.response;

import carteirafiis.carteira.enums.transaction.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record GetTransactionResponse(
        Integer id,
        int quantity,
        BigDecimal unitPrice,
        LocalDate date,
        BigDecimal totalExpense,
        TransactionType type
) {
}
