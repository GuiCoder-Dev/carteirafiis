package carteirafiis.carteira.controller.request;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PostEarningsRequest(

        @NotNull(message = "fii_id cannot be empty")
        Integer fii_id,

        @NotNull(message = "Unit Value Payment cannot be empty")
        BigDecimal unitValuePayment,

        @NotNull(message = "payment date cannot be empty")
        LocalDate paymentDate

) {
}
