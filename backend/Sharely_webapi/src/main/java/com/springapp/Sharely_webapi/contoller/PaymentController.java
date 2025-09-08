package com.springapp.Sharely_webapi.contoller;

import com.springapp.Sharely_webapi.dto.PaymentDTO;
import com.springapp.Sharely_webapi.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody PaymentDTO paymentDTO) {
        PaymentDTO response = paymentService.createOrder(paymentDTO);

        if (response.getSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/success/{orderId}")
    public ResponseEntity<?> markSuccess(@PathVariable String orderId) {
        PaymentDTO response = paymentService.markSuccess(orderId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/failure/{orderId}")
    public ResponseEntity<?> markFailure(@PathVariable String orderId) {
        PaymentDTO response = paymentService.markFailure(orderId);
        return ResponseEntity.ok(response);
    }
}
