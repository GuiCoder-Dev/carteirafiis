package carteirafiis.carteira.controller.request;

import carteirafiis.carteira.enums.fii.Type;


public record PutFiiRequest(

        String code,

        Type type

) {
}
