package com.fizzy.avmmock;

import com.fizzy.avmmock.config.AvmMockConfig;
import com.fizzy.avmmock.config.SecurityConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@EnableAutoConfiguration
@Import({SecurityConfiguration.class, AvmMockConfig.class})
@EnableZuulProxy
public class AvmMockApplication {

    public static void main(String[] args) {
        SpringApplication.run(AvmMockApplication.class, args);
    }
}
