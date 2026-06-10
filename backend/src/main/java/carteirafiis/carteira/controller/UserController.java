package carteirafiis.carteira.controller;


import carteirafiis.carteira.controller.request.PostUserRequest;
import carteirafiis.carteira.controller.request.ResendCodeRequest;
import carteirafiis.carteira.controller.request.VerifiyEmailRequest;
import carteirafiis.carteira.mapper.Mapper;
import carteirafiis.carteira.service.UserService;
import com.resend.core.exception.ResendException;
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
    public void createUser(@RequestBody @Valid PostUserRequest user) throws ResendException {
        userService.createUser(mapper.toUserModel(user));
    }

    @PostMapping("/verify-email")
    @ResponseStatus(HttpStatus.OK)
    public void verifyEmail(@RequestBody @Valid VerifiyEmailRequest request) {
        userService.verifyEmail(request);
    }

    @PostMapping("/resend-code")
    @ResponseStatus(HttpStatus.OK)
    public void resendCode(@RequestBody @Valid ResendCodeRequest request) throws ResendException {
        userService.resendCode(request);
    }

    // Ver se ao invés de colocar para mandar o código na criação não ter que ser na autentiação, pois o e-mail será igual
    // Após acabar e funcionar, fazer commit
    // Registrar o fluxo no Notion


}
