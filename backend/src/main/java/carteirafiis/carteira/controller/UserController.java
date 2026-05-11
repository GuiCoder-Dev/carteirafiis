package carteirafiis.carteira.controller;


import carteirafiis.carteira.controller.request.PostUserRequest;
import carteirafiis.carteira.mapper.UserMapper;
import carteirafiis.carteira.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/creates")
    @ResponseStatus(HttpStatus.CREATED)
    public void createUser(@RequestBody @Valid PostUserRequest user){
        userService.createUser(UserMapper.toUserModel(user));
    }


}
