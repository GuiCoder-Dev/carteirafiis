package carteirafiis.carteira.mapper;

import carteirafiis.carteira.controller.request.PostFiiRequest;
import carteirafiis.carteira.controller.request.PostUserRequest;
import carteirafiis.carteira.controller.request.PutFiiRequest;
import carteirafiis.carteira.controller.response.GetFiiResponse;
import carteirafiis.carteira.enums.user.Role;
import carteirafiis.carteira.enums.user.Status;
import carteirafiis.carteira.model.FiiModel;
import carteirafiis.carteira.model.UserModel;
import carteirafiis.carteira.service.UserService;
import org.springframework.stereotype.Component;

@Component
public class Mapper {

    private final UserService userService;

    public Mapper(UserService userService) {
        this.userService = userService;
    }


    // Request to Model
    public UserModel toUserModel(PostUserRequest request){

        if(request == null) return null;

        UserModel user = new UserModel();

        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(request.password());
        user.setStatus(Status.ACTIVE);
        user.setRole(Role.USER);

        return user;
    }

    public FiiModel toFiiModelPost(PostFiiRequest request, UserModel user){

        FiiModel fii = new FiiModel();

        fii.setCode(request.code());
        fii.setType(request.type());
        fii.setUser(user);

        return fii;
    }

    public FiiModel toFiiModelPut(PutFiiRequest request, UserModel user){

        FiiModel fii = new FiiModel();

        fii.setId(user.getId());
        fii.setUser(user);

        fii.setCode(request.code() != null ? request.code() : fii.getCode());
        fii.setType(request.type() != null ? request.type() : fii.getType());


        return fii;
    }

    // Model to Response
    public GetFiiResponse toFiiResponse(FiiModel fii){

        return new GetFiiResponse(
                fii.getId(),
                fii.getCode(),
                fii.getType()
        );

    }

}

