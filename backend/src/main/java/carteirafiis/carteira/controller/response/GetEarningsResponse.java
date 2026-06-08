package carteirafiis.carteira.controller.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public record GetEarningsResponse(

    Integer id,
    BigDecimal UnitValuePayment,
    LocalDate paymentDate,
    BigDecimal TotalGain,
    String fiiCode,
    int quantity

) {
}
