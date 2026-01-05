package com.blockchainrafik.JEmittor;

import com.blockchainrafik.JEmittor.rules.CreateRule;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class JEmittorApplicationTests {
	@Test
	void tests_whenUserCreateRules_theyAreTriggeredImmediately(){
		CreateRule rule = new CreateRule("ami",2,2);
	}
}
