package carteirafiis.carteira.service;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Value("${resend.api-key}")
    private String apiKey;

    public void sendEmail(String toEmail, String code) throws ResendException {
        try {
            Resend resend = new Resend(apiKey);

            if (apiKey == null || apiKey.isEmpty()) {
                System.err.println("RESEND_API_KEY environment variable is required");
                System.exit(1);
            }

            CreateEmailOptions params = CreateEmailOptions.builder()
                    .from("Carteira FIIs <onboarding@resend.dev>")
                    .to(toEmail)
                    .subject("verification code - Carteirafiis")
                    .html("<h2>Seu código de verificação é: <strong>" + code + "</strong></h2> " + "<p>Expira em 15 minutos.</p>")
                    .build();

            resend.emails().send(params);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send verification email", e);
        }
    }




}
