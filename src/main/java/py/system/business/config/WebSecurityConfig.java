package py.system.business.config;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.ServletListenerRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.session.HttpSessionEventPublisher;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	DataSource dataSource;

	@Bean
	SessionRegistry sessionRegistry() {
		return new SessionRegistryImpl();
	}

	@Autowired
	CustomAuthenticationSuccessHandler sm;

	@Autowired
	CustomLogoutSuccessHandler lgm;

	@Bean
	public PasswordEncoder passwordencoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public ActiveUserStore activeUserStore() {
		return new ActiveUserStore();
	}

	@Bean
	public static ServletListenerRegistrationBean httpSessionEventPublisher() {
		return new ServletListenerRegistrationBean(new HttpSessionEventPublisher());
	}
	
	@Autowired
	public void configAuthentication(AuthenticationManagerBuilder auth) throws Exception {
		auth.jdbcAuthentication() // 1
				.dataSource(dataSource) // 2
				.usersByUsernameQuery("select LOWER(usuario),contrasena, activo from usuario where LOWER(usuario)=?") // 3
				.authoritiesByUsernameQuery("select LOWER(b.usuario), a.authority from user_authority a join usuario b on b.idusuario = a.idusuario where LOWER(b.usuario)=?") // 4
				.passwordEncoder(passwordencoder()); // 5
	}
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.authorizeRequests()
		.antMatchers("/", "/resources/static/**","/login").permitAll()
        .antMatchers("/*").access("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
        .and().formLogin();

		http.authorizeRequests().antMatchers("/home") // 1
				.access("hasRole('ROLE_USER')") // 2
				.anyRequest().permitAll() // 3
				.and() // 4
				.formLogin() // 5
				.loginPage("/login") // 6
				.usernameParameter("username") // 7
				.passwordParameter("password") // 8
				.and() // 9
				.logout() // 10
				.addLogoutHandler(lgm) // 11
				.logoutSuccessUrl("/login?logout") // 12
				.and() // 13
				.exceptionHandling() // 14
				.accessDeniedPage("/403") // 15
				.and() // 16
				.formLogin() // 17
				.successHandler(sm) // 18
				.and() // 19
				.csrf().disable(); // 20

		http.sessionManagement().maximumSessions(-1) // (1)
				.maxSessionsPreventsLogin(false) // (2)
				.expiredUrl("/login") // (3)
				.sessionRegistry(sessionRegistry()); // (4)
	}
}
