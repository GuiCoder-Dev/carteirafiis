package carteirafiis.carteira.controller;


import carteirafiis.carteira.controller.request.PostUserRequest;
import carteirafiis.carteira.mapper.Mapper;
import carteirafiis.carteira.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final Mapper mapper;

    public UserController(UserService userService, Mapper mapper) {
        this.userService = userService;
        this.mapper = mapper;
    }

    @PostMapping("/creates")
    @ResponseStatus(HttpStatus.CREATED)
    public void createUser(@RequestBody @Valid PostUserRequest user){
        userService.createUser(mapper.toUserModel(user));
    }


}
