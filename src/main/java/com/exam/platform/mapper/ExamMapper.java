package com.exam.platform.mapper;

import com.exam.platform.dto.request.ExamRequest;
import com.exam.platform.dto.response.ExamResponse;
import com.exam.platform.entity.Exam;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ExamMapper {

    @Mapping(target = "professorName", source = "professor.username")
    @Mapping(target = "questions", ignore = true)
    ExamResponse toResponse(Exam exam);

    List<ExamResponse> toResponseList(List<Exam> exams);

    Exam toEntity(ExamRequest request);
}