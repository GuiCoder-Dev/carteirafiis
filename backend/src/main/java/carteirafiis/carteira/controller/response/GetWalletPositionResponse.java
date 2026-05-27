package carteirafiis.carteira.controller.response;

import java.math.BigDecimal;

public record GetWalletPositionResponse(

        String fiiCode,
        String type,
        int monthlyQuantity,
        int totalAccumulatedQuantity,
        BigDecimal monthlyExpense,
        BigDecimal totalExpense,
        BigDecimal averagePrice

) {
}
