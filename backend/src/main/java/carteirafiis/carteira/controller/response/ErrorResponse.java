package carteirafiis.carteira.controller.response;

public record ErrorResponse(

        int status,
        String message

) {
}
