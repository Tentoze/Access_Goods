package accessgoods.model.chat.dto;

import accessgoods.model.Account;
import accessgoods.model.chat.ChatRoom;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessageDto {
    private Long id;
    private String content;
    private Long receiverAccountId;
    private Long senderAccountId;
    private Long chatRoomId;
    private String messageTimestamp;
}
