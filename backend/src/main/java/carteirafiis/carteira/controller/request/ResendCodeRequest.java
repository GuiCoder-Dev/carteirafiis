package carteirafiis.carteira.controller.request;

import jakarta.validation.constraints.NotBlank;

public record ResendCodeRequest(

        @NotBlank(message = "email cannot be empty")
        String email

) {
}
