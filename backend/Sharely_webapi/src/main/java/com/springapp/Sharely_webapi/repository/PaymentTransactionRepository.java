package com.springapp.Sharely_webapi.repository;

import com.springapp.Sharely_webapi.document.PaymentTransaction;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PaymentTransactionRepository extends MongoRepository<PaymentTransaction, String> {


    PaymentTransaction findByOrderId(String orderId);


    List<PaymentTransaction> findByClerkIdAndStatusOrderByTransactionDateDesc(String clerkId, String status);


    List<PaymentTransaction> findByClerkIdOrderByTransactionDateDesc(String clerkId);
}


