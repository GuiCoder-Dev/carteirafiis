package carteirafiis.carteira.controller.request;

import carteirafiis.carteira.enums.fii.Type;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PostFiiRequest(

        @NotBlank(message = "code cannot be empty")
        String code,

        @NotNull(message = "type cannot be empty")
        Type type

) {
}
