package accessgoods.model.mapper;

import accessgoods.model.Account;
import accessgoods.model.Opinion;
import accessgoods.model.dto.OpinionDto;
import accessgoods.model.dto.OpinionPostDto;
import org.mapstruct.Mapper;

@Mapper
public interface OpinionMapper extends MapperBase<Opinion, OpinionDto, OpinionPostDto>{
    @Override
    default Opinion postDtoToEntity(OpinionPostDto opinionPostDto) {
        return Opinion.builder()
                .opinionReceiverAccount(Account.builder().id(opinionPostDto.getOpinionReceiverAccountId()).build())
                .opinionGiverAccount(Account.builder().id(opinionPostDto.getOpinionGiverAccountId()).build())
                .feedbackTarget(opinionPostDto.getFeedbackTarget())
                .description(opinionPostDto.getDescription())
                .rating(opinionPostDto.getRating())
                .build();
    }

    @Override
    default OpinionDto entityToDto(Opinion opinion) {
        return OpinionDto.builder()
                .id(opinion.getId())
                .opinionReceiverAccountId(opinion.getOpinionReceiverAccount().getId())
                .opinionGiverAccountId(opinion.getOpinionGiverAccount().getId())
                .feedbackTarget(opinion.getFeedbackTarget())
                .description(opinion.getDescription())
                .rating(opinion.getRating())
                .build();
    }
}
