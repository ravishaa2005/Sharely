package com.springapp.Sharely_webapi.service;

import com.springapp.Sharely_webapi.document.PaymentTransaction;
import com.springapp.Sharely_webapi.document.ProfileDocument;
import com.springapp.Sharely_webapi.document.UserCredits;
import com.springapp.Sharely_webapi.dto.PaymentDTO;
import com.springapp.Sharely_webapi.repository.PaymentTransactionRepository;
import com.springapp.Sharely_webapi.service.ProfileService;
import com.springapp.Sharely_webapi.service.UserCreditsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final ProfileService profileService;
    private final UserCreditsService userCreditsService;
    private final PaymentTransactionRepository paymentTransactionRepository;

    public PaymentDTO createOrder(PaymentDTO paymentDTO) {
        try {
            ProfileDocument currentProfile = profileService.getCurrentProfile();
            String clerkId = currentProfile.getClerkId();

            String orderId = "order_test_" + UUID.randomUUID().toString().substring(0, 8);

            PaymentTransaction transaction = PaymentTransaction.builder()
                    .clerkId(clerkId)
                    .orderId(orderId)
                    .planId(paymentDTO.getPlanId())
                    .amount(paymentDTO.getAmount())
                    .currency(paymentDTO.getCurrency())
                    .creditsAdded(0) // initially no credits
                    .status("PENDING")
                    .transactionDate(LocalDateTime.now())
                    .userEmail(currentProfile.getEmail())
                    .userName(currentProfile.getFirstName() + " " + currentProfile.getLastName())
                    .build();

            paymentTransactionRepository.save(transaction);

            return PaymentDTO.builder()
                    .orderId(orderId)
                    .success(true)
                    .message("Mock order created successfully")
                    .build();

        } catch (Exception e) {
            return PaymentDTO.builder()
                    .success(false)
                    .message("Error creating order: " + e.getMessage())
                    .build();
        }
    }

    public PaymentDTO markSuccess(String orderId) {
        PaymentTransaction transaction = paymentTransactionRepository.findByOrderId(orderId);
        if (transaction == null) {
            return PaymentDTO.builder()
                    .success(false)
                    .message("Order not found")
                    .build();
        }

        int creditsToAdd = getCreditsForPlan(transaction.getPlanId());

        UserCredits updatedCredits = userCreditsService.addCredits(
                transaction.getClerkId(),
                creditsToAdd,
                transaction.getPlanId()
        );

        transaction.setStatus("SUCCESS");
        transaction.setCreditsAdded(creditsToAdd);
        paymentTransactionRepository.save(transaction);

        return PaymentDTO.builder()
                .orderId(orderId)
                .success(true)
                .message("Payment marked as SUCCESS. " + creditsToAdd + " credits added.")
                .credits(updatedCredits.getCredits()) // new total
                .build();
    }

    public PaymentDTO markFailure(String orderId) {
        PaymentTransaction transaction = paymentTransactionRepository.findByOrderId(orderId);
        if (transaction == null) {
            return PaymentDTO.builder()
                    .success(false)
                    .message("Order not found")
                    .build();
        }

        transaction.setStatus("FAILED");
        paymentTransactionRepository.save(transaction);

        return PaymentDTO.builder()
                .orderId(orderId)
                .success(false)
                .message("Payment marked as FAILED")
                .build();
    }

    private int getCreditsForPlan(String planId) {
        switch (planId.toUpperCase()) {

            case "PREMIUM": return 500;
            case "ULTIMATE": return 2500;
            default: return 0;
        }
    }
}
