/*****************************************************************
 * 
 * Copyright(c) 2025 ROUNDERS. All rights reserved.
 * This software is the proprietary information of ROUNDERS.
 * 
 *****************************************************************/
package com.rounders.pposeek.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import com.rounders.pposeek.common.business.auth.AuthService;
import com.rounders.pposeek.common.model.dto.auth.LoginDto;
import com.rounders.pposeek.common.model.dto.auth.RegisterDto;
import com.rounders.pposeek.common.model.dto.auth.TokenInfo;
import com.rounders.pposeek.common.model.dto.common.ResponseMessage;
import com.rounders.pposeek.common.model.dto.user.UserDto;

/**
 * 인증 관련 Rest API 처리 컨트롤러.
 * 
 * @author siunkimm@gmail.com
 * @since 2025
 * 
 * @apiNote
 * 2025	siunkimm	최초 작성<br/>
 */
@RestController
@RequestMapping(value = "/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;

    @PostMapping(value = "/login")
    public ResponseEntity<ResponseMessage> login(
            @RequestHeader HttpHeaders headers,
            @RequestBody LoginDto loginDto) {

        ResponseMessage responseMessage = new ResponseMessage();

        try {
            // 로그인 처리
            TokenInfo tokenInfo = authService.login(loginDto);
            
            responseMessage.setHttpStatus(HttpStatus.OK);
            responseMessage.setData(tokenInfo);
            responseMessage.setMessage("로그인 성공");

            return new ResponseEntity<>(responseMessage, new HttpHeaders(), responseMessage.getHttpStatus());
            
        } catch (Exception e) {
            responseMessage.setHttpStatus(HttpStatus.BAD_REQUEST);
            responseMessage.setMessage("로그인 실패: " + e.getMessage());
            return new ResponseEntity<>(responseMessage, new HttpHeaders(), responseMessage.getHttpStatus());
        }
    }

    @PostMapping(value = "/register")
    public ResponseEntity<ResponseMessage> register(
            @RequestHeader HttpHeaders headers,
            @RequestBody RegisterDto registerDto) {

        ResponseMessage responseMessage = new ResponseMessage();

        try {
            // 회원가입 처리
            UserDto registeredUser = authService.register(registerDto);
            
            responseMessage.setHttpStatus(HttpStatus.CREATED);
            responseMessage.setData(registeredUser);
            responseMessage.setMessage("회원가입 성공");

            return new ResponseEntity<>(responseMessage, new HttpHeaders(), responseMessage.getHttpStatus());
            
        } catch (Exception e) {
            responseMessage.setHttpStatus(HttpStatus.BAD_REQUEST);
            responseMessage.setMessage("회원가입 실패: " + e.getMessage());
            return new ResponseEntity<>(responseMessage, new HttpHeaders(), responseMessage.getHttpStatus());
        }
    }

    @GetMapping(value = "/me")
    public ResponseEntity<ResponseMessage> getCurrentUser(
            @RequestHeader("Authorization") String token) {

        ResponseMessage responseMessage = new ResponseMessage();

        try {
            // Bearer 토큰에서 실제 토큰 추출
            String actualToken = StringUtils.hasText(token) && token.startsWith("Bearer ") 
                ? token.substring(7) : token;
            
            // 현재 사용자 정보 조회
            UserDto currentUser = authService.getCurrentUser(actualToken);
            
            if (currentUser != null) {
                responseMessage.setHttpStatus(HttpStatus.OK);
                responseMessage.setData(currentUser);
                responseMessage.setMessage("사용자 정보 조회 성공");
            } else {
                responseMessage.setHttpStatus(HttpStatus.NOT_FOUND);
                responseMessage.setMessage("사용자 정보를 찾을 수 없습니다");
            }

            return new ResponseEntity<>(responseMessage, new HttpHeaders(), responseMessage.getHttpStatus());
            
        } catch (Exception e) {
            responseMessage.setHttpStatus(HttpStatus.BAD_REQUEST);
            responseMessage.setMessage("사용자 정보 조회 실패: " + e.getMessage());
            return new ResponseEntity<>(responseMessage, new HttpHeaders(), responseMessage.getHttpStatus());
        }
    }

    @GetMapping(value = "/check-username")
    public ResponseEntity<ResponseMessage> checkUsernameDuplicate(
            @RequestParam String username) {

        ResponseMessage responseMessage = new ResponseMessage();

        try {
            // 사용자명 중복 체크
            boolean isDuplicate = authService.checkUsernameDuplicate(username);
            
            responseMessage.setHttpStatus(HttpStatus.OK);
            responseMessage.setData(isDuplicate);
            responseMessage.setMessage(isDuplicate ? "중복된 사용자명입니다" : "사용 가능한 사용자명입니다");

            return new ResponseEntity<>(responseMessage, new HttpHeaders(), responseMessage.getHttpStatus());
            
        } catch (Exception e) {
            responseMessage.setHttpStatus(HttpStatus.BAD_REQUEST);
            responseMessage.setMessage("사용자명 중복 체크 실패: " + e.getMessage());
            return new ResponseEntity<>(responseMessage, new HttpHeaders(), responseMessage.getHttpStatus());
        }
    }
}