package carteirafiis.carteira.controller;


import carteirafiis.carteira.controller.request.PostFiiRequest;
import carteirafiis.carteira.controller.request.PutFiiRequest;
import carteirafiis.carteira.controller.response.GetFiiResponse;
import carteirafiis.carteira.mapper.Mapper;
import carteirafiis.carteira.model.FiiModel;
import carteirafiis.carteira.model.UserModel;
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
    private final UserService userService;
    private final Mapper mapper;

    public FiiController(FiiService fiiService, UserService userService, Mapper mapper) {
        this.fiiService = fiiService;
        this.userService = userService;
        this.mapper = mapper;
    }

    @PostMapping("/creates")
    @ResponseStatus(HttpStatus.CREATED)
    public void createFii(@RequestBody @Valid PostFiiRequest fii){
        UserModel userId = userService.getById(fii.user_id());
        fiiService.createFii(mapper.toFiiModelPost(fii, userId));
    }

    @GetMapping("/lists")
    @ResponseStatus(HttpStatus.OK)
    public Page<GetFiiResponse> listFii(@PageableDefault(page = 0, size = 10) Pageable pageable){
        return fiiService.listFii(pageable).map(mapper::toFiiResponse);
    }

    @PutMapping("/updates/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateFii(@PathVariable int id, @RequestBody PutFiiRequest fii){
        UserModel user = userService.getById(id);
        fiiService.updateFii(mapper.toFiiModelPut(fii, user));
    }

    @DeleteMapping("/deletes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFii(@PathVariable int id){
        FiiModel fiiModel = fiiService.getById(id);
        fiiService.deleteFii(fiiModel);
    }









}
