package carteirafiis.carteira.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "tb_earnings")
@Getter
@Setter
public class EarningsModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "fii_id")
    private FiiModel fii;

    @Column(name = "unit_value_payment")
    private BigDecimal UnitValuePayment;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column(name = "total_gain")
    private BigDecimal TotalGain;

}
