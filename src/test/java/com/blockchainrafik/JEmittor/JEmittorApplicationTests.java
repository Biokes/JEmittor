package com.blockchainrafik.JEmittor;

import com.blockchainrafik.JEmittor.rules.CreateRule;
import com.blockchainrafik.JEmittor.utils.Coins;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.Period;

@SpringBootTest
class JEmittorApplicationTests {
	@Test
	void tests_whenUserCreateRules_theyAreTriggeredImmediately(){
		CreateRule rule = new CreateRule(Coins.SUI,2, 10);
	}
}
