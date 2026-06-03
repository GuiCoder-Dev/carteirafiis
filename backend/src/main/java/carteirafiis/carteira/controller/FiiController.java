package carteirafiis.carteira.controller;


import carteirafiis.carteira.controller.request.PostFiiRequest;
import carteirafiis.carteira.controller.request.PutFiiRequest;
import carteirafiis.carteira.controller.response.GetFiiResponse;
import carteirafiis.carteira.mapper.Mapper;
import carteirafiis.carteira.model.FiiModel;
import carteirafiis.carteira.model.UserModel;
import carteirafiis.carteira.security.AuthUtil;
import carteirafiis.carteira.service.FiiService;
import carteirafiis.carteira.service.UserService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fiis")
public class FiiController {


    private final FiiService fiiService;
    private final Mapper mapper;
    private final AuthUtil authUtil;

    public FiiController(FiiService fiiService, UserService userService, Mapper mapper, AuthUtil authUtil) {
        this.fiiService = fiiService;
        this.mapper = mapper;
        this.authUtil = authUtil;
    }

    // JWT OK
    @PostMapping("/creates")
    @ResponseStatus(HttpStatus.CREATED)
    public void createFii(@RequestBody @Valid PostFiiRequest fii){
        UserModel user = authUtil.getLoggedUser();
        fiiService.createFii(mapper.toFiiModelPost(fii, user));
    }

    // JWT OK
    @GetMapping("/lists")
    @ResponseStatus(HttpStatus.OK)
    public Page<GetFiiResponse> listFii(@PageableDefault(page = 0, size = 10) Pageable pageable){
        return fiiService.listFii(pageable).map(mapper::toFiiResponse);
    }

    // JWT OK
    @PutMapping("/updates/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateFii(@PathVariable int id, @RequestBody PutFiiRequest request){
        FiiModel fii = fiiService.getById(id);
        fiiService.updateFii(mapper.toFiiModelPut(request, fii));
    }

    // JWT OK
    @DeleteMapping("/deletes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFii(@PathVariable int id){
        FiiModel fiiModel = fiiService.getById(id);
        fiiService.deleteFii(fiiModel);
    }









}
