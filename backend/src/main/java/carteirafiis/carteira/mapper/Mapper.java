package carteirafiis.carteira.mapper;

import carteirafiis.carteira.controller.request.*;
import carteirafiis.carteira.controller.response.GetEarningsResponse;
import carteirafiis.carteira.controller.response.GetFiiResponse;
import carteirafiis.carteira.controller.response.GetTransactionResponse;
import carteirafiis.carteira.enums.user.Role;
import carteirafiis.carteira.enums.user.Status;
import carteirafiis.carteira.model.EarningsModel;
import carteirafiis.carteira.model.FiiModel;
import carteirafiis.carteira.model.TransactionModel;
import carteirafiis.carteira.model.UserModel;
import carteirafiis.carteira.service.UserService;
import org.springframework.stereotype.Component;

@Component
public class Mapper {

    private final UserService userService;

    public Mapper(UserService userService) {
        this.userService = userService;
    }


    // Request to Model
    public UserModel toUserModel(PostUserRequest request){

        if(request == null) return null;

        UserModel user = new UserModel();

        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(request.password());
        user.setStatus(Status.ACTIVE);
        user.setRole(Role.USER);

        return user;
    }

    public FiiModel toFiiModelPost(PostFiiRequest request, UserModel user){

        FiiModel fii = new FiiModel();

        fii.setCode(request.code());
        fii.setType(request.type());
        fii.setUser(user);

        return fii;
    }

    public FiiModel toFiiModelPut(PutFiiRequest request, FiiModel fii){

        if (request.code() != null) {
            fii.setCode(request.code());
        }

        if (request.type() != null) {
            fii.setType(request.type());
        }

        return fii;
    }

    public TransactionModel toTransactionModelPost(PostTransactionRequest request, FiiModel fii){

        TransactionModel transaction = new TransactionModel();

        transaction.setFii(fii);
        transaction.setQuantity(request.quantity());
        transaction.setUnitPrice(request.unitPrice());
        transaction.setDate(request.date());
        transaction.setType(request.type());

        return transaction;
    }

    public EarningsModel toEarningsModelPost(PostEarningsRequest request, FiiModel fii){

        EarningsModel earnings = new EarningsModel();

        earnings.setFii(fii);
        earnings.setUnitValuePayment(request.unitValuePayment());
        earnings.setPaymentDate(request.paymentDate());

        return earnings;
    }

    public EarningsModel toEarningsModelPut(PutEarningRequest request, EarningsModel earnings){

        if(request.paymentDate() != null){
            earnings.setPaymentDate(request.paymentDate());
        }

        if(request.unitValuePayment() != null){
            earnings.setUnitValuePayment(request.unitValuePayment());
        }

        return earnings;
    }

    // Model to Response
    public GetFiiResponse toFiiResponse(FiiModel fii){

        return new GetFiiResponse(
                fii.getId(),
                fii.getCode(),
                fii.getType()
        );

    }

    public GetTransactionResponse toTransactionResponse(TransactionModel transaction){

        return new GetTransactionResponse(
                transaction.getId(),
                transaction.getQuantity(),
                transaction.getUnitPrice(),
                transaction.getDate(),
                transaction.getTotalExpense(),
                transaction.getType()
        );

    }

    public GetEarningsResponse toEarningsResponse(EarningsModel earnings, int quantity){

        return new GetEarningsResponse(
                earnings.getId(),
                earnings.getUnitValuePayment(),
                earnings.getPaymentDate(),
                earnings.getTotalGain(),
                earnings.getFii().getCode(),
                quantity
        );

    }



}

