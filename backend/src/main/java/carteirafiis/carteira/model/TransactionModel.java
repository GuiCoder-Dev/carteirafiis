package carteirafiis.carteira.model;


import carteirafiis.carteira.enums.transaction.TransactionType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "tb_transaction")
@Getter
@Setter
public class TransactionModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "fii_id")
    private FiiModel fii;

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "unit_price")
    private BigDecimal unitPrice;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "total_expense")
    private BigDecimal totalExpense;

    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    private TransactionType type;
}
