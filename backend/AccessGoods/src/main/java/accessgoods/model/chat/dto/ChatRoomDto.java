package accessgoods.model.chat.dto;

import accessgoods.model.Account;
import accessgoods.model.Item;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatRoomDto {

    private Long id;
    private Long itemId;
    private String itemPhoto;
    private String itemName;
    private Long itemOwnerAccountId;
    private String itemOwnerAccountPhoto;
    private String itemOwnerAccountName;
    private Long senderAccountId;
    private String senderAccountPhoto;
    private String senderAccountName;
    private String messageTimestamp;
    private String lastMessage;

}

