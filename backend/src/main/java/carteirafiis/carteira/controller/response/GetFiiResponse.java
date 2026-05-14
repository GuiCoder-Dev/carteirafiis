package carteirafiis.carteira.controller.response;

import carteirafiis.carteira.enums.fii.Type;



public record GetFiiResponse(
    Integer id,
    String code,
    Type type
) {
}
