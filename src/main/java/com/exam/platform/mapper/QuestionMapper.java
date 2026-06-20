package com.exam.platform.mapper;

import com.exam.platform.dto.request.QuestionRequest;
import com.exam.platform.dto.response.QuestionResponse;
import com.exam.platform.entity.Question;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface QuestionMapper {

    @Mapping(target = "correctAnswer", ignore = true)
    QuestionResponse toResponse(Question question);

    List<QuestionResponse> toResponseList(List<Question> questions);

    Question toEntity(QuestionRequest request);
}