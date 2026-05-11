package carteirafiis.carteira.mapper;

import carteirafiis.carteira.controller.request.PostUserRequest;
import carteirafiis.carteira.enums.user.Role;
import carteirafiis.carteira.enums.user.Status;
import carteirafiis.carteira.model.UserModel;

public class UserMapper {

    // Request to Model
    public static UserModel toUserModel(PostUserRequest request){

        if(request == null) return null;

        UserModel user = new UserModel();

        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(request.password());
        user.setStatus(Status.ACTIVE);
        user.setRole(Role.USER);

        return user;
    }
}

