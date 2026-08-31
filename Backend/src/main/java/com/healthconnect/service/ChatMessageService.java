package com.healthconnect.service;

import com.healthconnect.entity.ChatMessage;
import com.healthconnect.entity.Consultation;
import com.healthconnect.repository.ChatMessageRepository;
import com.healthconnect.repository.ConsultationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ConsultationRepository consultationRepository;

    public ChatMessageService(ChatMessageRepository chatMessageRepository, ConsultationRepository consultationRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.consultationRepository = consultationRepository;
    }

    public ChatMessage sendMessage(ChatMessage chatMessage) {
        Consultation consultation = consultationRepository.findById(chatMessage.getConsultationId())
                .orElseThrow(() -> new IllegalArgumentException("Consultation not found."));

        if (!"ACCEPTED".equalsIgnoreCase(consultation.getStatus())) {
            throw new IllegalStateException("Chat is only allowed for ACCEPTED consultations.");
        }

        chatMessage.setTimestamp(LocalDateTime.now());
        return chatMessageRepository.save(chatMessage);
    }

    public List<ChatMessage> getMessagesByConsultation(Long consultationId) {
        return chatMessageRepository.findByConsultationIdOrderByTimestampAsc(consultationId);
    }
}