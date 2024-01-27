package accessgoods.model.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessagePostDto {
    Long chatRoomId;
    Long userReceiverId;
    String content;
}
