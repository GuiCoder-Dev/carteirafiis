package carteirafiis.carteira.controller;

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

    @GetMapping("/position/{userId}")
    @ResponseStatus(HttpStatus.OK)
    public List<GetWalletPositionResponse> getPosition(@PathVariable Integer userId,
    @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM") YearMonth month){
            return walletService.getPositionByUser(userId, month);
    }

    // fazer get


}
