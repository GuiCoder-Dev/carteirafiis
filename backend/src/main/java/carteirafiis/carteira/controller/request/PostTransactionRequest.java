package carteirafiis.carteira.controller.request;


import carteirafiis.carteira.enums.transaction.TransactionType;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PostTransactionRequest(

        @NotNull(message = "fii_id cannot be empty")
        Integer fii_id,

        @NotNull(message = "quantity cannot be empty")
        int quantity,

        @NotNull(message = "unit price cannot be empty")
        BigDecimal unitPrice,

        LocalDate date,

        @NotNull(message = "transaction type cannot be empty")
        TransactionType type
){

}
