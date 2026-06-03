package carteirafiis.carteira.security;

import carteirafiis.carteira.model.UserModel;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthUtil {

    public UserModel getLoggedUser(){
        return (UserModel) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }

}
