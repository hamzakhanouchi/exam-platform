package com.exam.platform.mapper;

import com.exam.platform.dto.response.ResultResponse;
import com.exam.platform.entity.StudentResult;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ResultMapper {

    @Mapping(target = "examTitle", source = "exam.title")
    @Mapping(target = "tabSwitchCount", source = "session.tabSwitchCount")
    @Mapping(target = "pasteAttemptCount", source = "session.pasteAttemptCount")
    ResultResponse toResponse(StudentResult result);

    List<ResultResponse> toResponseList(List<StudentResult> results);
}