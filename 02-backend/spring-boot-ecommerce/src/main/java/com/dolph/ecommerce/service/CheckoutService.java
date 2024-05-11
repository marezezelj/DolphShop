package com.dolph.ecommerce.service;

import com.dolph.ecommerce.dto.Purchase;
import com.dolph.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}
