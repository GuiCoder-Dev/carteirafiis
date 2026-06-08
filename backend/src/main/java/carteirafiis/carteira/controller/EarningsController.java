package carteirafiis.carteira.controller;


import carteirafiis.carteira.controller.request.PostEarningsRequest;
import carteirafiis.carteira.controller.request.PutEarningRequest;
import carteirafiis.carteira.controller.response.GetEarningsResponse;
import carteirafiis.carteira.mapper.Mapper;
import carteirafiis.carteira.model.EarningsModel;
import carteirafiis.carteira.model.FiiModel;
import carteirafiis.carteira.security.AuthUtil;
import carteirafiis.carteira.service.EarningsService;
import carteirafiis.carteira.service.FiiService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/earnings")
public class EarningsController {

    private final EarningsService earningsService;
    private final FiiService fiiService;
    private final Mapper mapper;
    private final AuthUtil authUtil;

    public EarningsController(EarningsService earningsService, FiiService fiiService, Mapper mapper, AuthUtil authUtil) {
        this.earningsService = earningsService;
        this.fiiService = fiiService;
        this.mapper = mapper;
        this.authUtil = authUtil;
    }

    // JWT OK
    @PostMapping("/payments")
    @ResponseStatus(HttpStatus.CREATED)
    public void paymentEarnings(@RequestBody @Valid PostEarningsRequest earnings){
        FiiModel fii_id = fiiService.getById(earnings.fii_id());
        earningsService.create(mapper.toEarningsModelPost(earnings, fii_id));
    }

    // JWT OK
    @GetMapping("/lists")
    @ResponseStatus(HttpStatus.OK)
    public Page<GetEarningsResponse> listEarnings(@PageableDefault(page = 0, size = 10) Pageable pageable){
        return earningsService.listEarnings(pageable);
    }

    // JWT OK
    @PutMapping("/updates/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateFii(@PathVariable int id, @RequestBody PutEarningRequest earnings){
        EarningsModel earningsModel = earningsService.getById(id);
        earningsService.updateEarnings(mapper.toEarningsModelPut(earnings, earningsModel));
    }

    // JWT OK
    @DeleteMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEarnings(@PathVariable int id){
        EarningsModel earningsModel = earningsService.getById(id);
        earningsService.deleteEarnings(earningsModel);
    }



}
