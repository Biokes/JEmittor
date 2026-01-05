package com.blockchainrafik.JEmittor.rules;

import com.blockchainrafik.JEmittor.utils.Coins;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class CreateRule {
    private Coins coin;
    private Integer percentage;
    private Integer notificationMinutesTimePerWindow;
}
