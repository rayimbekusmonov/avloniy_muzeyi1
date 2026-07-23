package uz.rayimbek.avloniy_muzeyi.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import uz.rayimbek.avloniy_muzeyi.entity.User;
import uz.rayimbek.avloniy_muzeyi.repository.UserRepository;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.default-admin.username:admin}")
    private String defaultUsername;

    @Value("${app.default-admin.password:admin123}")
    private String defaultPassword;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            log.info("Foydalanuvchilar topilmadi. Boshlang'ich admin akkaunti yaratilmoqda...");
            User admin = User.builder()
                    .username(defaultUsername)
                    .password(passwordEncoder.encode(defaultPassword))
                    .role(User.Role.ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("Boshlang'ich admin yaratildi. Username: '{}'", defaultUsername);
        }
    }
}
