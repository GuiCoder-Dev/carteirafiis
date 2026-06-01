package carteirafiis.carteira.controller;

import carteirafiis.carteira.controller.request.AuthRequest;
import carteirafiis.carteira.controller.response.AuthResponse;
import carteirafiis.carteira.model.UserModel;
import carteirafiis.carteira.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {


    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public AuthResponse login(@RequestBody AuthRequest request){

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(request.email(), request.password());

        Authentication auth = authenticationManager.authenticate(authToken);

        String token = jwtService.generateToken((UserModel)  auth.getPrincipal());

        return new AuthResponse(token);
    }


}
