package accessgoods.controllers;

import accessgoods.model.Image;
import accessgoods.model.Item;
import accessgoods.model.chat.ChatMessage;
import accessgoods.model.chat.ChatRoom;
import accessgoods.model.chat.dto.ChatMessageDto;
import accessgoods.model.chat.dto.ChatMessagePostDto;
import accessgoods.model.chat.dto.ChatRoomDto;
import accessgoods.model.dto.FilterSearchDto;
import accessgoods.model.dto.ItemDto;
import accessgoods.model.mapper.ItemMapper;
import accessgoods.service.ChatService;
import jakarta.persistence.EntityNotFoundException;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/chat")
public class ChatController {
    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }
    @PostMapping("/createOrGetChatRoom/{itemId}")
    public ResponseEntity<ChatRoomDto> createOrGetChatRoom(@PathVariable Long itemId) {
        try {
            ChatRoom chatRoom = chatService.createOrGetChatRoom(itemId);
            return ok(ChatRoomDto.builder().id(chatRoom.getId())
                    .itemId(chatRoom.getItem().getId())
                    .itemOwnerAccountId(chatRoom.getItemOwnerAccount().getId())
                    .itemOwnerAccountPhoto(chatRoom.getItemOwnerAccount().getPhoto())
                    .itemOwnerAccountName(chatRoom.getItemOwnerAccount().getFirstName() + " " + chatRoom.getItemOwnerAccount().getLastName())
                    .senderAccountPhoto(chatRoom.getSenderAccount().getPhoto())
                    .senderAccountName(chatRoom.getSenderAccount().getFirstName() + " " + chatRoom.getSenderAccount().getLastName())
                    .senderAccountId(chatRoom.getSenderAccount().getId())
                    .messageTimestamp(chatRoom.getMessageTimestamp().format(DateTimeFormatter.ofPattern("MM/dd/yyyy 'at' hh:mm")))
                    .itemPhoto(chatRoom.getItem().getImages().stream().findFirst().map(Image::getImage).orElseGet(() -> {return "";}))
                    .itemName(chatRoom.getItem().getName())
                    .lastMessage(chatRoom.getLastMessage())
                    .build());
        }catch (Exception e) {
            throw new EntityNotFoundException(e.getMessage());
        }
    }
    @PostMapping("/sendMessage")
    public ResponseEntity<ChatMessageDto> sendMessage(@RequestBody ChatMessagePostDto chatMessagePostDto) {
        try {
            ChatMessage chatMessage = chatService.sendMessage(chatMessagePostDto.getChatRoomId(), chatMessagePostDto.getUserReceiverId(), chatMessagePostDto.getContent());
            return ok(ChatMessageDto.builder()
                    .id(chatMessage.getId())
                    .senderAccountId(chatMessage.getSenderAccount().getId())
                    .receiverAccountId(chatMessage.getReceiverAccount().getId())
                    .chatRoomId(chatMessage.getChatRoom().getId())
                    .content(chatMessage.getContent())
                    .messageTimestamp(chatMessage.getMessageTimestamp().format(DateTimeFormatter.ofPattern("MM/dd/yyyy 'at' hh:mm")))
                    .build());
        }catch (Exception e) {
            throw new EntityNotFoundException(e.getMessage());
        }
    }
    @GetMapping("/getChatRoomHistory/{chatRoomId}")
    public ResponseEntity<List<ChatMessageDto>> getChatHistory(@PathVariable Long chatRoomId) {
        try {
            return ok(chatService.getChatHistory(chatRoomId));
        }catch (Exception e) {
            throw new EntityNotFoundException(e.getMessage());
        }
    }
    @GetMapping("/getChatRoomList")
    public ResponseEntity<List<ChatRoomDto>> getChatRoomList() {
        try {
            return ok(chatService.getChatRooms());
        }catch (Exception e) {
            throw new EntityNotFoundException(e.getMessage());
        }
    }
}
