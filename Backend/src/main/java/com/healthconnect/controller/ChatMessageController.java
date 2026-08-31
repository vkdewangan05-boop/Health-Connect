package com.healthconnect.controller;

import com.healthconnect.entity.ChatMessage;
import com.healthconnect.service.ChatMessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatMessageController {

    private final ChatMessageService chatMessageService;

    public ChatMessageController(ChatMessageService chatMessageService) {
        this.chatMessageService = chatMessageService;
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody ChatMessage message) {
        try {
            return ResponseEntity.ok(chatMessageService.sendMessage(message));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/history/{consultationId}")
    public ResponseEntity<List<ChatMessage>> getChatHistory(@PathVariable Long consultationId) {
        return ResponseEntity.ok(chatMessageService.getMessagesByConsultation(consultationId));
    }
}