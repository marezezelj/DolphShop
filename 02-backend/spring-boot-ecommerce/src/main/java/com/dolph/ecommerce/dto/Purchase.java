package com.dolph.ecommerce.dto;

import com.dolph.ecommerce.entity.Address;
import com.dolph.ecommerce.entity.Customer;
import com.dolph.ecommerce.entity.Order;
import com.dolph.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
