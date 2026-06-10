package carteirafiis.carteira.controller.request;

import carteirafiis.carteira.validation.domain.EmailAvaliable;
import carteirafiis.carteira.validation.unique.EmailUnique;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record PostUserRequest(

        @NotBlank(message = "name cannot be empty")
        String name,

        @NotBlank(message = "email cannot be empty")
        @EmailAvaliable
        @EmailUnique
        @Email
        String email,

        @NotBlank(message = "password cannot be empty")
        String password

) {
}
