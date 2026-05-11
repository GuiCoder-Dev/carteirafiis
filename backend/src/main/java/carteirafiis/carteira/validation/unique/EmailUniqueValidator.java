package carteirafiis.carteira.validation.unique;

import carteirafiis.carteira.service.UserService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class EmailUniqueValidator implements ConstraintValidator<EmailUnique, String> {

    private final UserService userService;

    public EmailUniqueValidator(UserService userService) {
        this.userService = userService;
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context){
        if(value==null || value.isEmpty()){
            return false;
        }

       return userService.existsEmail(value);
    }


}
