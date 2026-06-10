package carteirafiis.carteira.controller.request;

import jakarta.validation.constraints.NotBlank;

public record VerifiyEmailRequest(

        @NotBlank(message = "email cannot be empty")
        String email,

        @NotBlank(message = "code cannot be empty")
        String code

) {
}
