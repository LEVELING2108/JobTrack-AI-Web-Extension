package com.jobtrack.mapper;

import com.jobtrack.dto.response.UserProfileResponse;
import com.jobtrack.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserProfileResponse toProfileResponse(User user) {
        if (user == null) return null;

        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
