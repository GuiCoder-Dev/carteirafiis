package carteirafiis.carteira.controller;

import carteirafiis.carteira.controller.response.GetWalletAll;
import carteirafiis.carteira.controller.response.GetWalletPositionResponse;
import carteirafiis.carteira.service.WalletService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/wallets")
public class WalletController {

    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @GetMapping("/position")
    @ResponseStatus(HttpStatus.OK)
    public List<GetWalletPositionResponse> getPosition(@RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM") YearMonth month){
        return walletService.getPositionByUser(month);
    }

    @GetMapping("/all")
    @ResponseStatus(HttpStatus.OK)
    public List<GetWalletAll> getAll(@RequestParam @DateTimeFormat(pattern = "yyyy-MM") YearMonth month){
        return walletService.getAll(month);
    }

}
