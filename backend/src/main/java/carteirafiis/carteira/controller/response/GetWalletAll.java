package carteirafiis.carteira.controller.response;

import java.math.BigDecimal;

public record GetWalletAll(

        String fiiCode,
        String type,

        int monthlyQuantity,
        int totalAccumulatedQuantity,
        BigDecimal monthlyExpense,
        BigDecimal totalExpense,
        BigDecimal averagePrice,

        BigDecimal unitValuePayment,
        BigDecimal totalGain

) {

}
