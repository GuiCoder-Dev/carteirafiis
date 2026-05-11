package carteirafiis.carteira.validation.domain;


import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import javax.naming.directory.Attributes;
import javax.naming.directory.InitialDirContext;
import java.util.Hashtable;

public class EmailAvaliableValidator implements ConstraintValidator<EmailAvaliable, String> {

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        if (email == null || email.trim().isEmpty()|| !email.contains("@")||!email.contains(".com")) {
            return false;
        } else {
            return isDomainValid(email);
        }
    }

    private boolean isDomainValid(String email) {
        String domain = "";
        int atIndex = email.lastIndexOf('@');
        if (atIndex != -1) {
            domain = email.substring(atIndex + 1);
        }

        if (domain.trim().isEmpty()) {
            return false;
        }

        try {
            Hashtable<String, String> env = new Hashtable<>();
            env.put("java.naming.factory.initial", "com.sun.jndi.dns.DnsContextFactory");

            InitialDirContext ctx = new InitialDirContext(env);
            Attributes attrs = ctx.getAttributes(domain, new String[]{"MX"});

            return attrs.get("MX") != null;

        } catch (Exception ex) {

            return false;
        }
    }


}
