package com.exam.platform.mapper;

import com.exam.platform.dto.response.SessionResponse;
import com.exam.platform.dto.response.SessionStartResponse;
import com.exam.platform.entity.ExamSession;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SessionMapper {

    @Mapping(target = "sessionId", source = "id")   // ← indispensable
    @Mapping(target = "examTitle", source = "exam.title")
    @Mapping(target = "durationMinutes", source = "exam.durationMinutes")
    @Mapping(target = "questions", ignore = true)  // on les ajoute manuellement
    SessionStartResponse toStartResponse(ExamSession session);

    @Mapping(target = "sessionId", source = "id")   // ← indispensable
    @Mapping(target = "examId", source = "exam.id")
    @Mapping(target = "examTitle", source = "exam.title")
    @Mapping(target = "questions", ignore = true)
    SessionResponse toResponse(ExamSession session);
}