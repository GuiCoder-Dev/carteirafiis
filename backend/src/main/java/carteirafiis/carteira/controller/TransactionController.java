package carteirafiis.carteira.controller;

import carteirafiis.carteira.controller.request.PostTransactionRequest;
import carteirafiis.carteira.controller.response.GetTransactionResponse;
import carteirafiis.carteira.mapper.Mapper;
import carteirafiis.carteira.model.FiiModel;
import carteirafiis.carteira.service.FiiService;
import carteirafiis.carteira.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService transactionService;
    private final FiiService fiiService;
    private final Mapper mapper;

    public TransactionController(TransactionService transactionService, FiiService fiiService, Mapper mapper) {
        this.transactionService = transactionService;
        this.fiiService = fiiService;
        this.mapper = mapper;
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public void createTransaction(@RequestBody @Valid PostTransactionRequest transaction) {
        FiiModel fii_id = fiiService.getById(transaction.fii_id());
        transactionService.createTransaction(mapper.toTransactionModelPost(transaction, fii_id));
    }

    @GetMapping("/lists")
    @ResponseStatus(HttpStatus.OK)
    public Page<GetTransactionResponse> listTransaction(@PageableDefault(page = 0, size = 10) Pageable pageable){
        return transactionService.listTransaction(pageable).map(mapper::toTransactionResponse);
    }


}
