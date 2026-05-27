package carteirafiis.carteira.controller.request;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PutEarningRequest(

        BigDecimal unitValuePayment,

        LocalDate paymentDate

) {
}
